import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAccentById, getWords } from "@/lib/curriculum/queries";

const searchParamsSchema = z.object({
  difficulty: z
    .string()
    .transform((v) => Number.parseInt(v, 10))
    .pipe(z.number().int().min(1).max(5))
    .optional(),
  page: z
    .string()
    .default("1")
    .transform((v) => Number.parseInt(v, 10))
    .pipe(z.number().int().min(1))
    .optional()
    .default(1),
  limit: z
    .string()
    .default("20")
    .transform((v) => Number.parseInt(v, 10))
    .pipe(z.number().int().min(1).max(100))
    .optional()
    .default(20),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accentId: string }> },
) {
  const { accentId } = await params;

  // Validate accent exists
  const accent = await getAccentById(accentId);
  if (!accent) {
    return NextResponse.json(
      { error: "Accent not found" },
      { status: 404 },
    );
  }

  // Parse and validate query params
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = searchParamsSchema.safeParse(searchParams);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { difficulty, page, limit } = parsed.data;
  const offset = (page - 1) * limit;

  const result = await getWords(accentId, { difficulty, limit, offset });

  return NextResponse.json({
    words: result.words,
    total: result.total,
    page,
    limit,
  });
}
