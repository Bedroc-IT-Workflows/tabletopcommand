function getRoadmapBuildInfo() {
  return window.TABLETOP_BUILD || {
    version: "1.0.0-local",
    buildDate: "Local development"
  };
}

function formatRoadmapBuildDate(value) {
  if (!value || value === "Local development") return "Local development";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return `Built ${date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
}

const build = getRoadmapBuildInfo();
document.querySelector("#footerBuildVersion").textContent = `v${build.version}`;
document.querySelector("#footerBuildDate").textContent = formatRoadmapBuildDate(build.buildDate);
