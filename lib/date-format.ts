const PRESENT_LABELS = new Set(["present", "current", "至今", "現在", "현재"])

const MONTHS: Record<string, string> = {
  jan: "01",
  january: "01",
  feb: "02",
  february: "02",
  mar: "03",
  march: "03",
  apr: "04",
  april: "04",
  may: "05",
  jun: "06",
  june: "06",
  jul: "07",
  july: "07",
  aug: "08",
  august: "08",
  sep: "09",
  sept: "09",
  september: "09",
  oct: "10",
  october: "10",
  nov: "11",
  november: "11",
  dec: "12",
  december: "12",
}

function padMonth(value: string | number): string {
  const month = Number.parseInt(String(value), 10)
  if (!Number.isFinite(month) || month < 1 || month > 12) return "00"
  return String(month).padStart(2, "0")
}

export function formatToYearMonth(value?: string | number | null): string {
  if (value === undefined || value === null) return ""
  const raw = String(value).trim()
  if (!raw) return ""
  if (PRESENT_LABELS.has(raw.toLowerCase())) return raw

  if (raw.includes(",") || raw.includes("，") || raw.includes("、")) {
    return raw
      .split(/,\s*|，\s*|、\s*/)
      .map((part) => formatToYearMonth(part))
      .join(", ")
  }

  const direct = raw.match(/^(\d{4})[.\-/](\d{1,2})(?:[.\-/]\d{1,2})?$/)
  if (direct) return `${direct[1]}${padMonth(direct[2])}`

  const cjk = raw.match(/^(\d{4})年\s*(\d{1,2})月?$/)
  if (cjk) return `${cjk[1]}${padMonth(cjk[2])}`

  const english = raw.match(/^([A-Za-z]{3,9})\s+(\d{4})$/)
  if (english) {
    const month = MONTHS[english[1].toLowerCase()]
    if (month) return `${english[2]}${month}`
  }

  const yearOnly = raw.match(/^(\d{4})$/)
  if (yearOnly) return yearOnly[1]

  const isoLike = raw.match(/^(\d{4})-(\d{2})-\d{2}/)
  if (isoLike) return `${isoLike[1]}${isoLike[2]}`

  return raw
}

export function formatDateRangeToYearMonth(start?: string, end?: string): string {
  const formattedStart = formatToYearMonth(start)
  const formattedEnd = formatToYearMonth(end)
  if (!formattedStart) return formattedEnd
  if (!formattedEnd) return formattedStart
  return `${formattedStart} - ${formattedEnd}`
}
