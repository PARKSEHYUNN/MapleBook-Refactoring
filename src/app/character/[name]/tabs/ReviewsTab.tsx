"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Flag, ImagePlus, Loader2, Pencil, Star, Trash2, X } from "lucide-react";

import LoginModal from "@/components/auth/LoginModal";
import { formatDate } from "@/lib/formatters";
import { ReviewReportReason } from "@/types/common";

const REPORT_REASONS: ReviewReportReason[] = ["스팸", "욕설/비하", "허위 정보", "기타"];

export interface ReviewItem {
  id: number;
  reviewerId: number;
  mannerScore: number;
  content: string | null;
  createdAt: string;
  reviewerCharacterName: string | null;
  reviewerCharacterImage: string | null;
}

interface ReviewFormProps {
  characterName: string;
  onSuccess: (review: ReviewItem) => void;
}

function ReviewForm({ characterName, onSuccess }: ReviewFormProps) {
  const [selected, setSelected] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected === 0) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/character/${encodeURIComponent(characterName)}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mannerScore: selected,
          content: content.trim() || undefined,
        }),
      });

      const data = (await res.json()) as { error?: string; review: ReviewItem };

      if (!res.ok) {
        setError(data.error ?? "오류가 발생했습니다");
        return;
      }

      setSelected(0);
      setContent("");
      onSuccess(data.review);
    } catch {
      setError("네트워크 오류가 발생했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-base-300 bg-base-200/30 p-4 flex flex-col gap-3"
    >
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => {
          const val = i + 1;
          return (
            <button
              key={val}
              type="button"
              onClick={() => setSelected(val)}
              className="transition-colors"
            >
              <Star
                width={20}
                height={20}
                className={
                  val <= selected
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-base-300 text-base-300"
                }
              />
            </button>
          );
        })}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="이 캐릭터와의 경험을 공유해주세요 (선택)"
        rows={3}
        maxLength={1000}
        className="w-full resize-none rounded-lg bg-base-100 border border-base-300 px-3 py-2 text-sm text-base-content placeholder:text-base-content/30 outline-none focus:ring-2 focus:ring-base-300 transition"
      />

      <div className="flex flex-wrap gap-2">
        <label className="w-16 h-16 shrink-0 rounded-lg border-2 border-dashed border-base-300 flex flex-col items-center justify-center cursor-pointer hover:border-base-content/30 transition-colors">
          <input type="file" accept="image/*" className="hidden" multiple />
          <ImagePlus width={16} height={16} className="text-base-content/30" />
          <span className="text-xs text-base-content/30 mt-0.5">0/5</span>
        </label>
      </div>

      {error && <p className="text-xs text-error">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={selected === 0 || submitting}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-base-content text-base-100 hover:opacity-80 disabled:opacity-30 transition-colors"
        >
          {submitting && <Loader2 width={13} height={13} className="animate-spin" />}
          올리기
        </button>
      </div>
    </form>
  );
}

interface ReportModalProps {
  characterName: string;
  reviewId: number;
  onClose: () => void;
  onSuccess: () => void;
}

function ReportModal({ characterName, reviewId, onClose, onSuccess }: ReportModalProps) {
  const [reason, setReason] = useState<ReviewReportReason | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/character/${encodeURIComponent(characterName)}/review/${reviewId}/report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason, comment: comment.trim() || undefined }),
        },
      );

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "오류가 발생했습니다");
        return;
      }

      onSuccess();
    } catch {
      setError("네트워크 오류가 발생했습니다");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-sm mx-4 rounded-2xl border border-base-300 bg-base-100 shadow-xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-base-content">리뷰 신고</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-base-content/40 hover:text-base-content/70 hover:bg-base-200 transition-colors"
          >
            <X width={16} height={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <p className="text-xs text-base-content/50">신고 사유를 선택해주세요</p>

          <div className="flex flex-col gap-1.5">
            {REPORT_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm border transition-colors ${
                  reason === r
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-base-300 text-base-content/70 hover:border-base-content/30 hover:text-base-content"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="추가 설명 (선택)"
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-lg bg-base-100 border border-base-300 px-3 py-2 text-sm text-base-content placeholder:text-base-content/30 outline-none focus:ring-2 focus:ring-base-300 transition"
          />

          {error && <p className="text-xs text-error">{error}</p>}

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-sm text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!reason || submitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-error text-white hover:opacity-80 disabled:opacity-30 transition-colors"
            >
              {submitting && <Loader2 width={13} height={13} className="animate-spin" />}
              신고
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ReviewsTabProps {
  isOwner: boolean;
  isLoggedIn: boolean;
  hasMainCharacter: boolean;
  currentUserId: number | null;
  characterName: string;
  initialReviews: ReviewItem[];
  onOpenMainCharacterModal: () => void;
}

export default function ReviewsTab({
  isOwner,
  isLoggedIn,
  hasMainCharacter,
  currentUserId,
  characterName,
  initialReviews,
  onOpenMainCharacterModal,
}: ReviewsTabProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ mannerScore: number; content: string }>({
    mannerScore: 0,
    content: "",
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [reportingReviewId, setReportingReviewId] = useState<number | null>(null);
  const [reportedIds, setReportedIds] = useState<Set<number>>(new Set());

  function openEdit(review: ReviewItem) {
    setEditingReviewId(review.id);
    setEditForm({ mannerScore: review.mannerScore, content: review.content ?? "" });
    setEditError(null);
  }

  async function handleEditSubmit(reviewId: number) {
    if (editForm.mannerScore === 0) {
      return;
    }
    setEditSubmitting(true);
    setEditError(null);
    try {
      const res = await fetch(
        `/api/character/${encodeURIComponent(characterName)}/review/${reviewId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mannerScore: editForm.mannerScore,
            content: editForm.content.trim() || undefined,
          }),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setEditError(data.error ?? "오류가 발생했습니다");
        return;
      }
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, mannerScore: editForm.mannerScore, content: editForm.content.trim() || null }
            : r,
        ),
      );
      setEditingReviewId(null);
      router.refresh();
    } catch {
      setEditError("네트워크 오류가 발생했습니다");
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleDelete(reviewId: number) {
    setDeletingId(reviewId);
    try {
      const res = await fetch(
        `/api/character/${encodeURIComponent(characterName)}/review/${reviewId}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      {isOwner ? (
        <div className="rounded-xl border border-base-300 bg-base-200/30 px-4 py-6 text-center text-sm text-base-content/40">
          본인 캐릭터에는 리뷰를 작성할 수 없습니다
        </div>
      ) : !isLoggedIn ? (
        <div className="rounded-xl border border-base-300 bg-base-200/30 px-4 py-6 flex flex-col items-center gap-3">
          <span className="text-sm text-base-content/40">
            리뷰를 작성하려면 로그인이 필요합니다
          </span>
          <LoginModal />
        </div>
      ) : !hasMainCharacter ? (
        <div className="rounded-xl border border-base-300 bg-base-200/30 px-4 py-6 text-center text-sm text-base-content/40">
          리뷰를 작성하려면{" "}
          <button
            type="button"
            onClick={onOpenMainCharacterModal}
            className="underline hover:text-base-content/70 transition-colors"
          >
            대표 캐릭터
          </button>
          를 설정해야 합니다
        </div>
      ) : (
        <ReviewForm
          characterName={characterName}
          onSuccess={(review) => {
            setReviews((prev) => [review, ...prev]);
            router.refresh();
          }}
        />
      )}

      {reviews.length === 0 ? (
        <div className="py-6 text-center text-sm text-base-content/40">아직 리뷰가 없습니다</div>
      ) : (
        reviews.map((review) => {
          const isMine = currentUserId !== null && review.reviewerId === currentUserId;
          const isDeleting = deletingId === review.id;

          return (
            <div
              key={review.id}
              className="rounded-xl border border-base-300 bg-base-200/30 p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-base-300 overflow-hidden shrink-0">
                    {review.reviewerCharacterImage && (
                      <div className="relative w-full h-full">
                        <Image
                          src={review.reviewerCharacterImage}
                          alt={review.reviewerCharacterName ?? ""}
                          width={56}
                          height={56}
                          unoptimized
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[4] object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-base-content/90">
                      {review.reviewerCharacterName ?? "알 수 없음"}
                    </span>
                    <span className="text-[10px] text-base-content/40">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>

                {editingReviewId !== review.id && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          width={12}
                          height={12}
                          className={
                            i < review.mannerScore
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-base-300 text-base-300"
                          }
                        />
                      ))}
                    </div>

                    {isMine ? (
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          type="button"
                          onClick={() => openEdit(review)}
                          className="p-1 rounded-md text-base-content/30 hover:text-base-content/60 hover:bg-base-200 transition-colors"
                          title="수정"
                        >
                          <Pencil width={13} height={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(review.id)}
                          disabled={isDeleting}
                          className="p-1 rounded-md text-base-content/30 hover:text-error hover:bg-base-200 transition-colors disabled:opacity-30"
                          title="삭제"
                        >
                          {isDeleting ? (
                            <Loader2 width={13} height={13} className="animate-spin" />
                          ) : (
                            <Trash2 width={13} height={13} />
                          )}
                        </button>
                      </div>
                    ) : isLoggedIn ? (
                      <button
                        type="button"
                        onClick={() => setReportingReviewId(review.id)}
                        disabled={reportedIds.has(review.id)}
                        className="ml-1 p-1 rounded-md text-base-content/30 hover:text-warning hover:bg-base-200 transition-colors disabled:opacity-30"
                        title={reportedIds.has(review.id) ? "신고 완료" : "신고"}
                      >
                        <Flag
                          width={13}
                          height={13}
                          className={reportedIds.has(review.id) ? "text-warning" : ""}
                        />
                      </button>
                    ) : null}
                  </div>
                )}
              </div>

              {editingReviewId === review.id ? (
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => {
                      const val = i + 1;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setEditForm((f) => ({ ...f, mannerScore: val }))}
                          className="transition-colors"
                        >
                          <Star
                            width={18}
                            height={18}
                            className={
                              val <= editForm.mannerScore
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-base-300 text-base-300"
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                    rows={3}
                    maxLength={1000}
                    className="w-full resize-none rounded-lg bg-base-100 border border-base-300 px-3 py-2 text-sm text-base-content placeholder:text-base-content/30 outline-none focus:ring-2 focus:ring-base-300 transition"
                  />
                  {editError && <p className="text-xs text-error">{editError}</p>}
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingReviewId(null)}
                      className="px-3 py-1.5 rounded-lg text-sm text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditSubmit(review.id)}
                      disabled={editForm.mannerScore === 0 || editSubmitting}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-base-content text-base-100 hover:opacity-80 disabled:opacity-30 transition-colors"
                    >
                      {editSubmitting && (
                        <Loader2 width={13} height={13} className="animate-spin" />
                      )}
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                review.content && (
                  <p className="text-sm text-base-content/80 leading-relaxed">{review.content}</p>
                )
              )}
            </div>
          );
        })
      )}

      {reportingReviewId !== null && (
        <ReportModal
          characterName={characterName}
          reviewId={reportingReviewId}
          onClose={() => setReportingReviewId(null)}
          onSuccess={() => {
            setReportedIds((prev) => new Set(prev).add(reportingReviewId));
            setReportingReviewId(null);
          }}
        />
      )}
    </>
  );
}
