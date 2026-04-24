import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "../../components/core/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/core/Card";
import { supabase } from "../../config/supabase";
import { cn } from "../../utils/cn";

// dashboard user data
interface DashboardUpload {
  id: string;
  created_at: string;
  status: string;
  body_part: string | null;
  analysis: {
    risk_level: string;
    summary?: string;
    confidence?: number;
    severity_score?: number;
  } | null;
}

const RISK_COLORS: Record<string, string> = {
  CRITICAL: "text-red-700 bg-red-50 ring-red-200",
  HIGH: "text-orange-700 bg-orange-50 ring-orange-200",
  MODERATE: "text-amber-700 bg-amber-50 ring-amber-200",
  LOW: "text-emerald-700 bg-emerald-50 ring-emerald-200",
};

export function Dashboard() {
  const { data: uploads = [], isLoading } = useQuery<DashboardUpload[]>({
    queryKey: ["patient-dashboard-uploads"],
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
            risk_level,
            summary,
            confidence,
            severity_score
          )
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;

      return (data as unknown[]).map((raw) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const item = raw as Record<string, any>;
        const analysis = Array.isArray(item.analysis)
          ? item.analysis[0]
          : item.analysis;

        return {
          ...item,
          analysis,
        };
      }) as DashboardUpload[];
    },
  });

  return (
    <div className="space-y-6 fade-in font-body-md">
      <div>
        <h1 className="text-3xl font-bold text-primary font-serif italic tracking-tight">
          Welcome to Skintuition
        </h1>
        <p className="mt-2 text-secondary">
          Manage your skin health assessments and track your progress securely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 bg-primary text-on-primary border-none shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="space-y-4 max-w-md">
                <h2 className="text-2xl font-bold font-serif italic">
                  Start a New AI Scan
                </h2>
                <p className="text-primary-100">
                  Upload a photo of a skin concern for an immediate, confidential
                  AI-driven risk assessment.
                </p>
                <Link to="/patient/upload">
                  <Button
                    variant="secondary"
                    className="mt-4 bg-white text-primary hover:bg-surface-lowest w-full sm:w-auto font-bold rounded-full"
                  >
                    <span className="material-symbols-outlined mr-2 text-[20px]">cloud_upload</span>
                    Upload Image
                  </Button>
                </Link>
              </div>
              <div className="mt-6 sm:mt-0 opacity-20 hidden sm:block">
                <span className="material-symbols-outlined text-[120px]">plagiarism</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-surface-dim shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary flex items-center font-serif italic">
              <span className="material-symbols-outlined text-emerald-600 mr-2 text-[20px]">verified_user</span>
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(100%-4rem)] justify-between">
            <div>
              <p className="text-sm text-secondary mb-4">
                Your images are securely encrypted and automatically purged after 72
                hours.
              </p>
              <div className="bg-surface-lowest border border-surface-dim rounded-lg p-3 mb-4">
                <p className="text-xs font-semibold text-primary mb-1">
                  Data Protection
                </p>
                <p className="text-xs text-secondary">
                  You have the right to request the complete erasure of your account
                  and all associated health data.
                </p>
                <a
                  href="mailto:privacy@skintuition.com?subject=Right to Erasure Request"
                  className="mt-2 inline-flex items-center justify-center w-full px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors"
                >
                  Request Full Data Deletion
                </a>
              </div>
            </div>
            <div className="text-xs text-secondary border-t border-surface-dim pt-4 cursor-default font-medium">
              End-to-End Encrypted System
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-primary font-serif italic">
            Recent Scans
          </h3>
          {uploads.length > 0 && (
            <Link to="/patient/history">
              <Button
                variant="ghost"
                size="sm"
                className="text-secondary hover:text-primary rounded-full hover:bg-surface-container"
              >
                View Full History
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-secondary bg-surface-lowest rounded-xl border border-surface-dim">
            <span className="material-symbols-outlined animate-spin mr-2">sync</span>
            Loading scans...
          </div>
        ) : uploads.length === 0 ? (
          <Card className="bg-white border-surface-dim shadow-sm">
            <CardContent className="p-12 text-center text-secondary cursor-default">
              <div className="bg-surface-lowest w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-surface-dim">
                <span className="material-symbols-outlined text-[32px] text-primary">plagiarism</span>
              </div>
              <p className="text-primary font-bold text-lg mb-1 font-serif italic">
                No scans yet.
              </p>
              <p className="text-sm mb-6 text-secondary">
                Upload your first skin photo to get an AI assessment.
              </p>
              <Link to="/patient/upload">
                <Button variant="outline" className="bg-surface-lowest text-primary border-surface-dim hover:bg-surface-container rounded-full">
                  <span className="material-symbols-outlined mr-2 text-[18px]">document_scanner</span>
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
                  <div className="flex flex-col md:flex-row md:items-center p-0">
                    {/* dynamic risk edge */}
                    <div
                      className={cn(
                        "h-1.5 md:h-auto md:w-1.5 shrink-0",
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

                    <div className="flex-1 p-5 lg:p-6">
                      <div className="flex justify-between items-start mb-2">
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
                          <span className="text-sm font-medium text-secondary flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            {new Date(upload.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
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
                    </div>

                    <div className="bg-surface-lowest p-5 lg:p-6 border-t md:border-t-0 md:border-l border-surface-dim flex flex-col justify-center gap-3 w-full md:w-44 shrink-0">
                      <Link to={`/patient/scan/${upload.id}`}>
                        <Button className="w-full bg-white text-primary border border-surface-dim hover:bg-surface-container rounded-full font-semibold text-sm shadow-sm hover:shadow transition-all">
                          View Details
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
