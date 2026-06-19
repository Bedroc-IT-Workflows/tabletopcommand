const graphPhotoUrl = "https://graph.microsoft.com/v1.0/me/photos/48x48/$value";

module.exports = async function (context, req) {
  const accessToken = getHeader(req, "x-ms-token-aad-access-token");

  if (!accessToken) {
    context.res = noPhoto("missing-token");
    return;
  }

  try {
    const response = await fetch(graphPhotoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.status === 404) {
      context.res = noPhoto("not-found");
      return;
    }

    if (!response.ok) {
      context.log.warn(`Microsoft Graph photo request failed: ${response.status}`);
      context.res = noPhoto("graph-error");
      return;
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const bytes = Buffer.from(await response.arrayBuffer());

    context.res = {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600"
      },
      body: bytes
    };
  } catch (error) {
    context.log.warn(`Microsoft Graph photo request threw: ${error.message}`);
    context.res = noPhoto("request-failed");
  }
};

function getHeader(req, name) {
  const headers = req.headers || {};
  return headers[name] || headers[name.toLowerCase()] || "";
}

function noPhoto(reason) {
  return {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      "X-Avatar-Fallback": reason
    }
  };
}
