import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/core/Button";
import { Card, CardContent } from "../../components/core/Card";
import { RegimenWidget } from "../../components/medical/RegimenWidget";
import { supabase } from "../../config/supabase";
import { cn } from "../../utils/cn";

// patient history types
interface UploadHistoryItem {
  id: string;
  created_at: string;
  status: string;
  body_part: string | null;
  analysis: {
    id: string;
    risk_level: string;
    summary?: string;
    confidence?: number;
    severity_score?: number;
    xai_metadata?: {
      regimen?: {
        morning: Array<{ step: string; product: string; purpose: string }>;
        evening: Array<{ step: string; product: string; purpose: string }>;
      };
    };
  } | null;
}

const RISK_COLORS: Record<string, string> = {
  CRITICAL: "text-red-700 bg-red-50 ring-red-200",
  HIGH: "text-orange-700 bg-orange-50 ring-orange-200",
  MODERATE: "text-amber-700 bg-amber-50 ring-amber-200",
  LOW: "text-emerald-700 bg-emerald-50 ring-emerald-200",
};

export function ScanHistory() {
  const queryClient = useQueryClient();

  const { data: uploads = [], isLoading } = useQuery<UploadHistoryItem[]>({
    queryKey: ["patient-scan-history"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      const { data, error } = await supabase
        .from("uploads")
        .select(
          `
          id, created_at, status, body_part,
          analysis:analysis_results(
            id,
              risk_level,
              summary,
              confidence,
              severity_score,
              xai_metadata
            )
          `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mapped = (data as unknown[]).map((raw) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const item = raw as Record<string, any>;
        const analysis = Array.isArray(item.analysis)
          ? item.analysis[0]
          : item.analysis;

        return {
          ...item,
          analysis,
        };
      }) as UploadHistoryItem[];

      // Filter out incomplete/failed scans
      return mapped.filter((item) => {
        const risk = item.analysis?.risk_level;
        return risk && ["LOW", "MODERATE", "HIGH", "CRITICAL"].includes(risk);
      });
    },
  });

  // realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("scan-history-analysis-updates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "analysis_results" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["patient-scan-history"] });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="space-y-6 fade-in font-body-md">
      <div>
        <h1 className="text-3xl font-bold text-primary font-serif italic tracking-tight">Scan History</h1>
        <p className="mt-2 text-secondary">
          A complete record of all your secure skin scans and AI assessments.
        </p>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-secondary bg-surface-lowest rounded-xl border border-surface-dim">
            <span className="material-symbols-outlined animate-spin mr-2">sync</span>
            Loading your scan history...
          </div>
        ) : uploads.length === 0 ? (
          <Card className="bg-white border-surface-dim shadow-sm">
            <CardContent className="p-12 text-center text-secondary cursor-default">
              <div className="bg-surface-lowest w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-surface-dim">
                <span className="material-symbols-outlined text-[32px] text-primary">plagiarism</span>
              </div>
              <p className="text-primary font-bold text-lg mb-1 font-serif italic">
                No past scans found.
              </p>
              <p className="text-sm mb-6 text-secondary">
                Upload your first skin photo to get an AI assessment.
              </p>
              <Link to="/patient/upload">
                <Button variant="outline" className="bg-surface-lowest text-primary border-surface-dim hover:bg-surface-container rounded-full">
                  <span className="material-symbols-outlined text-[18px] mr-2">document_scanner</span>
                  Start your first scan
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {uploads.map((upload) => {
              const riskLevel = upload.analysis?.risk_level ?? "PENDING";

              return (
                <Card
                  key={upload.id}
                  className="bg-white border-surface-dim overflow-hidden shadow-sm hover:shadow transition-shadow"
                >
                  <div className="flex flex-col md:flex-row p-0">
                    {/* dynamic risk border */}
                    <div
                      className={cn(
                        "h-1.5 md:h-auto md:w-2 shrink-0 left-0 top-0",
                        riskLevel === "CRITICAL"
                          ? "bg-red-500"
                          : riskLevel === "HIGH"
                            ? "bg-orange-500"
                            : riskLevel === "MODERATE"
                              ? "bg-amber-500"
                              : riskLevel === "LOW"
                                ? "bg-emerald-500"
                                : "bg-surface-dim",
                      )}
                    />

                    <div className="flex-1 p-5 lg:p-6 pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span
                              className={cn(
                                "text-xs px-2.5 py-0.5 rounded-full font-bold tracking-wider ring-1 uppercase",
                                RISK_COLORS[riskLevel] ??
                                  "bg-surface-lowest text-secondary ring-surface-dim",
                              )}
                            >
                              {riskLevel} RISK
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg text-primary font-serif italic">
                            {upload.body_part
                              ? `Scan: ${upload.body_part}`
                              : "Skin Scan"}
                          </h3>
                          <span className="text-sm font-medium text-secondary flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            {new Date(upload.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>

                      {upload.analysis?.summary && (
                        <div className="mt-4 mb-2 bg-surface-lowest rounded-lg p-4 border border-surface-dim">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
                              AI Summary
                            </p>
                            {upload.analysis.confidence !== undefined && (
                              <span className="text-xs font-mono bg-white border border-surface-dim px-2 py-0.5 rounded text-primary font-medium shadow-sm">
                                Conf:{" "}
                                {(upload.analysis.confidence * 100).toFixed(1)}%
                                | Sev: {upload.analysis.severity_score}/10
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-primary leading-relaxed whitespace-pre-wrap">
                            {upload.analysis.summary
                              .replace(
                                /This AI screening tool is not a substitute for professional medical advice.*/,
                                "",
                              )
                              .trim()}
                          </p>
                        </div>
                      )}

                      {upload.analysis?.xai_metadata?.regimen && (
                        <div className="mt-4">
                          <RegimenWidget regimen={upload.analysis.xai_metadata.regimen} />
                        </div>
                      )}
                    </div>

                    <div className="bg-surface-lowest p-5 lg:p-6 border-t md:border-t-0 md:border-l border-surface-dim flex flex-col justify-center gap-3 w-full md:w-44 shrink-0">
                      <Link to="/patient/upload">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-on-primary border-none rounded-full font-semibold text-sm shadow-sm hover:shadow transition-all">
                          <span className="material-symbols-outlined text-[18px] mr-2">document_scanner</span>
                          New Scan
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
