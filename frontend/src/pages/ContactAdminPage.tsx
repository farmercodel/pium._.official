// ContactAdminPage.tsx
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import { motion } from "framer-motion";
import { useAnimationProps, container, flyUp, fade } from "../hooks/useAnimation";

type Inquiry = {
  id: number;
  question: string;
  answer?: string | null;
  created_at?: string;
  updated_at?: string;
  user?: { id: number; name?: string; email?: string };
};

type Filter = "ALL" | "UNANSWERED" | "ANSWERED";

type ParsedAttachment = {
  name?: string;
  sizeText?: string;
  url?: string;  // 공개 접근 URL
  rel?: string;  // presigned-get용 key
  isImage: boolean;
};

type ParsedInquiry = {
  body: string;                 // 첨부 블록 제거된 본문
  attachments: ParsedAttachment[];
};

/** 파일 확장자 기반 이미지 판별 */
const isImageByNameOrUrl = (s?: string) =>
  !!s && /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(s);

/** 문의 본문에서 [첨부파일] 블록 파싱 */
function parseInquiry(question: string): ParsedInquiry {
  const lines = question.split(/\r?\n/);
  const attachIdx = lines.findIndex((ln) => ln.trim().startsWith("[첨부파일]"));
  if (attachIdx === -1) {
    // 첨부 블록이 없다면 본문만 반환, URL 스캐닝(옵션)
    const urlMatches = question.match(/https?:\/\/\S+/g) || [];
    const attachments: ParsedAttachment[] = urlMatches.map((u) => ({
      url: u,
      isImage: isImageByNameOrUrl(u),
    }));
    return { body: question, attachments };
  }

  const body = lines.slice(0, attachIdx).join("\n").trim();
  const attachLines = lines.slice(attachIdx + 1).filter((ln) => ln.trim().length > 0);

  const attachments: ParsedAttachment[] = [];
  for (const raw of attachLines) {
    const line = raw.replace(/^\-\s*/, "").trim();

    // presign key 추출
    const presignMatch = line.match(/presign key:\s*([^)]+)\)/i);
    const rel = presignMatch?.[1]?.trim();

    // URL 추출
    const urlMatch = line.match(/https?:\/\/\S+/);
    const url = urlMatch ? urlMatch[0] : undefined;

    // 파일명/사이즈 추출: 끝의 괄호 블록 (filename, 1.2 MB)
    const metaMatch = line.match(/\(([^,()]+)\s*,\s*([^)]+)\)\s*$/);
    const name = metaMatch?.[1]?.trim();
    const sizeText = metaMatch?.[2]?.trim();

    attachments.push({
      name,
      sizeText,
      url,
      rel,
      isImage: isImageByNameOrUrl(url || name),
    });
  }

  return { body, attachments };
}

export const ContactAdminPage = (): JSX.Element => {
  const { heroAnim } = useAnimationProps();

  const [list, setList] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [q, setQ] = useState("");

  const [open, setOpen] = useState<Inquiry | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [sending, setSending] = useState(false);

  // 목록 불러오기
  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await api.get("/inquiries");

      // axios 인스턴스가 data를 이미 리턴하는 경우(res가 배열일 수도), 
      // 혹은 { data: [...] } / { items: [...] } 등 모든 케이스를 흡수
      const raw = (res as any)?.data ?? res;

      const arr: Inquiry[] =
        Array.isArray(raw) ? raw :
        Array.isArray(raw?.items) ? raw.items :
        Array.isArray(raw?.data) ? raw.data : [];

      setList(arr);
    } catch (e) {
      console.error(e);
      alert("문의 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // 필터/검색 적용
  const filtered = useMemo(() => {
    return (list ?? [])
      .filter((it) => {
        if (filter === "UNANSWERED") return !it.answer;
        if (filter === "ANSWERED") return !!it.answer;
        return true;
      })
      .filter((it) => {
        const key = `${it.question ?? ""} ${it.answer ?? ""} ${it.user?.name ?? ""}`.toLowerCase();
        return key.includes(q.toLowerCase());
      });
  }, [list, filter, q]);

  const openDetail = (it: Inquiry) => {
    setOpen(it);
    setAnswerText(it.answer ?? "");
  };

  const closeDetail = () => {
    setOpen(null);
    setAnswerText("");
  };

  // 답변 저장
  const submitAnswer = async () => {
    if (!open) return;
    setSending(true);
    try {
      const res = await api.post<Inquiry>(`/api/inquiries/${open.id}/answer`, { answer: answerText });
      // 목록의 해당 항목 갱신
      setList((prev) => prev.map((x) => (x.id === res.data.id ? res.data : x)));
      setOpen(res.data);
      alert("답변이 저장되었습니다.");
    } catch (e: any) {
      console.error(e);
      if (e?.response?.status === 403) alert("관리자만 답변할 수 있습니다.");
      else alert("답변 저장 실패");
    } finally {
      setSending(false);
    }
  };

  // Presigned GET
  const openPresigned = async (rel: string) => {
    try {
      const res = await api.get<{ url: string; expires_in: number }>("/files/presigned-get", {
        params: { key: rel, expires: 600 },
      });
      const url = res.data?.url;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.error(e);
      alert("임시 링크를 생성하지 못했습니다.");
    }
  };

  return (
    <main className="font-sans min-h-screen">
      {/* 배너 */}
      <section className="w-full py-16 bg-[#F9FAEA]">
        <motion.div className="mx-auto max-w-6xl px-6 text-center" variants={container} {...heroAnim}>
          <motion.h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900" variants={flyUp}>
            문의 관리
          </motion.h1>
          <motion.p className="mt-2 text-base sm:text-lg text-gray-700" variants={fade}>
            접수된 문의를 확인하고 답변을 작성합니다.
          </motion.p>
        </motion.div>
      </section>

      {/* 콘텐츠 */}
      <section className="relative w-full py-10">
        <motion.div className="mx-auto max-w-6xl px-6" variants={container} {...heroAnim}>
          {/* 검색/필터 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="질문/답변/이름 검색"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as Filter)}
                className="border border-gray-300 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <option value="ALL">전체</option>
                <option value="UNANSWERED">미답변</option>
                <option value="ANSWERED">답변완료</option>
              </select>
              <button
                onClick={fetchList}
                className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50"
              >
                새로고침
              </button>
            </div>
          </div>

          {/* 목록 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-gray-500">
              <div className="col-span-4 sm:col-span-3">이름 / 생성일</div>
              <div className="col-span-8 sm:col-span-9">질문</div>
            </div>

            {loading ? (
              <div className="px-5 py-10 text-center text-gray-500">불러오는 중...</div>
            ) : filtered.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-500">문의가 없습니다.</div>
            ) : (
              <ul role="list" className="divide-y">
                {filtered.map((it) => (
                  <li key={it.id}>
                    <button
                      onClick={() => openDetail(it)}
                      className="w-full text-left px-5 py-4 hover:bg-gray-50 transition focus:outline-none focus:bg-gray-50"
                    >
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-4 sm:col-span-3">
                          <div className="font-medium text-gray-900">{it.user?.name ?? "익명"}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(it.created_at ?? it.updated_at ?? Date.now()).toLocaleString()}
                          </div>
                          <span
                            className={`mt-1 inline-flex items-center px-2 py-1 text-xs rounded-full ${
                              it.answer
                                ? "bg-gray-100 text-gray-700 border border-gray-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {it.answer ? "답변완료" : "미답변"}
                          </span>
                        </div>
                        <div className="col-span-8 sm:col-span-9">
                          <div className="text-sm text-gray-700 line-clamp-2">{it.question}</div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        {/* 상세/답변 패널 */}
        <div className={`fixed inset-0 z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
            onClick={closeDetail}
          />
          <aside
            className={`absolute right-0 top-0 h-full w-full sm:w-[560px] bg-white shadow-xl border-l border-gray-100 transition-transform ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="font-semibold text-gray-900">문의 상세</div>
              <button
                onClick={closeDetail}
                className="w-9 h-9 rounded-full grid place-items-center hover:bg-gray-100"
                aria-label="닫기"
              >
                ×
              </button>
            </div>

            {!open ? null : (
              <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-60px)]">
                {/* 본문 + 첨부 */}
                <section className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-gray-500">보낸 사람</div>
                      <div className="font-medium text-gray-900">{open.user?.name ?? "익명"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">접수 일시</div>
                      <div className="text-gray-800">
                        {new Date(open.created_at ?? open.updated_at ?? Date.now()).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* 질문 본문/첨부 파싱 */}
                  {(() => {
                    const parsed = parseInquiry(open.question);
                    return (
                      <>
                        <div className="mt-4">
                          <div className="text-sm text-gray-500 mb-1">질문</div>
                          <div className="text-gray-800 whitespace-pre-wrap">{parsed.body}</div>
                        </div>

                        {parsed.attachments.length > 0 && (
                          <div className="mt-5">
                            <div className="text-sm text-gray-500 mb-2">첨부 파일</div>
                            <div className="grid grid-cols-3 gap-3">
                              {parsed.attachments.map((a, i) =>
                                a.isImage ? (
                                  a.url ? (
                                    <a
                                      key={i}
                                      href={a.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="block aspect-square overflow-hidden rounded-lg border border-gray-200"
                                      title={a.name}
                                    >
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={a.url} alt={a.name ?? `image-${i}`} className="w-full h-full object-cover" />
                                    </a>
                                  ) : a.rel ? (
                                    <button
                                      key={i}
                                      onClick={() => openPresigned(a.rel!)}
                                      className="aspect-square rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-700 hover:bg-gray-100"
                                      title={a.name}
                                    >
                                      Presigned 열기
                                    </button>
                                  ) : (
                                    <div key={i} className="aspect-square rounded-lg border border-gray-200 grid place-items-center text-xs text-gray-500">
                                      미지원 링크
                                    </div>
                                  )
                                ) : a.url ? (
                                  <a
                                    key={i}
                                    href={a.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-col items-center justify-center gap-1 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                                    title={a.name}
                                  >
                                    <span className="text-xs text-gray-700 truncate w-full text-center">{a.name ?? a.url}</span>
                                    {a.sizeText && <span className="text-[10px] text-gray-500">{a.sizeText}</span>}
                                  </a>
                                ) : a.rel ? (
                                  <button
                                    key={i}
                                    onClick={() => openPresigned(a.rel!)}
                                    className="rounded-lg border border-gray-200 px-2 py-3 hover:bg-gray-50 text-xs text-gray-700"
                                    title={a.name}
                                  >
                                    Presigned 열기
                                  </button>
                                ) : (
                                  <div key={i} className="rounded-lg border border-gray-200 px-2 py-3 text-xs text-gray-500">
                                    미지원 링크
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </section>

                {/* 답변 섹션 */}
                <section className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900">답변</h3>

                  {/* 기존 답변 표시 */}
                  {open.answer && (
                    <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-gray-800 whitespace-pre-wrap">
                      {open.answer}
                    </div>
                  )}

                  {/* 답변 입력 */}
                  <div className="mt-4 space-y-3">
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="답변 내용을 입력하세요."
                      rows={6}
                      className="w-full border border-gray-300 px-4 py-3 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={submitAnswer}
                        disabled={sending}
                        className="bg-gradient-to-r from-[#cfe89b] via-[#8fd77e] to-[#19c6d3] text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-70"
                      >
                        {sending ? "전송 중..." : "답변 저장"}
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ContactAdminPage;
