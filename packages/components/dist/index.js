import { jsx as a, Fragment as T, jsxs as U } from "react/jsx-runtime";
import { UserAuthCard as k, IntlProvider as q } from "@ory/elements";
import { usePathname as B, useRouter as O } from "next/navigation";
import { useState as R, useCallback as v, useEffect as _, createContext as $, useMemo as A, useContext as N } from "react";
import f, { useRouter as S } from "next/router";
import { FrontendApi as M, Configuration as J } from "@ory/client";
import j from "axios";
import { styled as G } from "@mui/material/styles";
const H = j.create({
  withCredentials: !0
}), g = new M(
  new J({
    basePath: process.env.NEXT_PUBLIC_ORY_SDK_URL || ""
  }),
  "",
  H
), P = (t = void 0, c = void 0, o = void 0, u = !1) => async (r) => {
  var h, s, e, l, d, w, p, y;
  if (!r.response || ((h = r.response) == null ? void 0 : h.status) === 0)
    return window.location.href = `/ui/error?error=${encodeURIComponent(JSON.stringify(r.response))}`, Promise.resolve();
  const n = ((s = r.response) == null ? void 0 : s.data) || {}, i = n == null ? void 0 : n.error;
  switch ((e = r.response) == null ? void 0 : e.status) {
    case 400: {
      if ((i == null ? void 0 : i.id) == "session_already_available")
        return await f.push("/"), Promise.resolve();
      if (c !== void 0)
        return console.warn("sdkError 400: update flow data"), c(n), Promise.resolve();
      break;
    }
    case 401:
      return console.warn("handleError hook 401: Navigate to /ui/login"), await f.push("/ui/login"), Promise.resolve();
    case 403: {
      if ((i == null ? void 0 : i.id) === "session_aal2_required")
        return await f.push("/ui/login?aal2=true"), f.reload(), Promise.resolve();
      if ((i == null ? void 0 : i.id) === "session_refresh_required" && n.redirect_browser_to)
        return console.warn("sdkError 403: Redirect browser to", n.redirect_browser_to), window.location.href = n.redirect_browser_to, Promise.resolve();
      break;
    }
    case 404: {
      console.warn("sdkError 404: Navigate to Error");
      const m = {
        data: ((l = r.response) == null ? void 0 : l.data) || r,
        status: (d = r.response) == null ? void 0 : d.status,
        statusText: (w = r.response) == null ? void 0 : w.statusText,
        url: window.location.href
      };
      return await f.push(`/ui/error?error=${encodeURIComponent(JSON.stringify(m))}`), Promise.resolve();
    }
    case 410: {
      if (t !== void 0 && n.use_flow_id !== void 0)
        return console.warn("sdkError 410: Update flow"), t(n.use_flow_id || "").catch((m) => {
          if (console.error(m), o !== void 0)
            f.push(o);
          else
            throw m;
        });
      if (o !== void 0)
        return console.warn("sdkError 410: Navigate to", o), await f.push(o), Promise.resolve();
      break;
    }
    case 422:
      if (n.redirect_browser_to !== void 0) {
        const m = new URL(window.location.href), b = new URL(n.redirect_browser_to);
        if (m.host !== b.host)
          return console.warn("sdkError 422: Host changed redirect"), window.location.href = n.redirect_browser_to, Promise.resolve();
        if (m.pathname !== b.pathname)
          return console.warn("sdkError 422: Update path"), await f.push(b.pathname + b.search), Promise.resolve();
        const x = b.searchParams.get("flow");
        return x != null && t !== void 0 ? (console.warn("sdkError 422: Update flow"), t(x).catch((C) => {
          if (console.error(C), o !== void 0)
            f.push(o);
          else
            throw C;
        })) : (console.warn("sdkError 422: Redirect browser to"), window.location.href = n.redirect_browser_to, Promise.resolve());
      }
  }
  if (u) {
    console.warn("sdkError: fatal error redirect to /error");
    const m = (p = r.response) == null ? void 0 : p.data;
    return await f.push({
      pathname: "/ui/error",
      query: {
        error: JSON.stringify(r, null, 2),
        id: (y = m.error) == null ? void 0 : y.id,
        flowType: f.pathname
      }
    }), Promise.resolve();
  }
  throw r;
};
function F() {
  return /* @__PURE__ */ a(T, { children: /* @__PURE__ */ a("div", { style: { width: "100%", height: "100vh", display: "flex", alignItems: "center" }, children: /* @__PURE__ */ a(
    "svg",
    {
      style: { margin: "auto", background: "transparent", display: "block" },
      width: "314px",
      height: "314px",
      viewBox: "0 0 100 100",
      preserveAspectRatio: "xMidYMid",
      children: /* @__PURE__ */ a(
        "path",
        {
          fill: "none",
          stroke: "#1d3f72",
          strokeWidth: "8",
          strokeDasharray: "42.76482137044271 42.76482137044271",
          d: "M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z",
          strokeLinecap: "round",
          style: { transform: "scale(0.8)", transformOrigin: "50px 50px" },
          children: /* @__PURE__ */ a(
            "animate",
            {
              attributeName: "stroke-dashoffset",
              repeatCount: "indefinite",
              dur: "2.2222222222222223s",
              keyTimes: "0;1",
              values: "0;256.58892822265625"
            }
          )
        }
      )
    }
  ) }) });
}
const L = G("main")(() => ({
  justifyContent: "center",
  display: "flex",
  height: "100vh",
  alignItems: "center"
})), Y = () => {
  const [t, c] = R(null), o = S(), u = String(o.query.return_to || ""), r = String(o.query.flow || ""), n = !!o.query.refresh, i = String(o.query.aal || ""), h = v(
    (d) => (
      // If ?flow=.. was in the URL, we fetch it
      g.getLoginFlow({ id: d }).then(({ data: w }) => {
        c(w);
      }).catch(s)
    ),
    []
  ), s = v(
    (d) => P(h, c, "/ui/login", !0)(d),
    [h]
  ), e = (d, w, p) => {
    g.createBrowserLoginFlow({
      refresh: d,
      // Check for two-factor authentication
      aal: w,
      returnTo: p
    }).then(({ data: y }) => {
      o.push(`/ui/login?flow=${y.id}`);
    }).catch((y) => {
      s(y);
    });
  };
  _(() => {
    if (o.isReady) {
      if (r) {
        h(r).catch(() => {
          e(n, i, u);
        });
        return;
      }
      e(n, i, u);
    }
  }, [o.isReady]);
  const l = (d) => g.updateLoginFlow({
    flow: String(t == null ? void 0 : t.id),
    updateLoginFlowBody: d
  }).then(() => {
    o.push("/");
  }).catch((w) => {
    s(w);
  });
  return t ? /* @__PURE__ */ a(L, { children: /* @__PURE__ */ a(
    "div",
    {
      className: "log",
      style: { height: "85vh" },
      children: /* @__PURE__ */ a(
        k,
        {
          flowType: "login",
          flow: t,
          additionalProps: {
            forgotPasswordURL: "/ui/recovery",
            signupURL: "/ui/registration"
          },
          includeScripts: !0,
          onSubmit: ({ body: d }) => l(d),
          cardImage: "https://storage.googleapis.com/bac-gcs-production/4e4ca2261e1d38fc07bb3b99f23d260262e115eba6d6f65c51c1d911de290a625413d9c6bbf186c580805f9f6783a5144186d86a4f52f1395b58ee373d554463.png",
          title: "Sign In"
        }
      )
    }
  ) }) : /* @__PURE__ */ a(F, {});
}, z = () => {
  const [t, c] = R(), o = S(), u = String(o.query.flow || ""), r = v(
    (s) => g.getRecoveryFlow({ id: s }).then(({ data: e }) => {
      c(e);
    }).catch(n),
    []
  ), n = v(
    (s) => {
      var l, d, w;
      const e = P(r, c, "/ui/registration", !0);
      if ((l = s.response) != null && l.status && ((d = s.response) == null ? void 0 : d.status) == 422) {
        const p = (w = s.response) == null ? void 0 : w.data;
        p != null && p.redirect_browser_to && (p.redirect_browser_to = `${window.location.origin}${p.redirect_browser_to}`);
      }
      return e(s);
    },
    [r]
  ), i = () => g.createBrowserRecoveryFlow().then(({ data: s }) => {
    c(s), o.push(`/ui/recovery?flow=${s.id}`);
  }).catch((s) => {
    n(s);
  });
  _(() => {
    if (o.isReady) {
      if (u) {
        r(u).catch(() => i());
        return;
      }
      i();
    }
  }, [o.isReady]);
  const h = (s) => g.updateRecoveryFlow({
    flow: String(t == null ? void 0 : t.id),
    updateRecoveryFlowBody: s
  }).then(({ data: e }) => {
    c(e);
  }).catch((e) => {
    n(e);
  });
  return t ? /* @__PURE__ */ a(L, { children: /* @__PURE__ */ a(
    "div",
    {
      className: "log",
      style: { height: "85vh" },
      children: /* @__PURE__ */ a(
        k,
        {
          flowType: "recovery",
          flow: t,
          additionalProps: {
            loginURL: "/ui/login"
          },
          includeScripts: !0,
          onSubmit: ({ body: s }) => h(s),
          cardImage: "https://storage.googleapis.com/bac-gcs-production/4e4ca2261e1d38fc07bb3b99f23d260262e115eba6d6f65c51c1d911de290a625413d9c6bbf186c580805f9f6783a5144186d86a4f52f1395b58ee373d554463.png"
        }
      )
    }
  ) }) : /* @__PURE__ */ a(F, {});
}, D = () => {
  const [t, c] = R(), o = S(), u = String(o.query.flow || ""), r = String(o.query.return_to || ""), n = v(
    (e) => g.getRegistrationFlow({ id: e }).then(({ data: l }) => {
      c(l);
    }).catch(i),
    []
  ), i = v(
    (e) => P(n, c, "/ui/registration", !0)(e),
    [n]
  ), h = v(
    (e) => g.createBrowserRegistrationFlow({
      returnTo: e
    }).then(({ data: l }) => {
      c(l), o.push(`/ui/registration?flow=${l.id}`);
    }).catch(i),
    [i]
  );
  _(() => {
    if (o.isReady) {
      if (u) {
        n(String(u || "")).catch(() => h(r));
        return;
      }
      h(r);
    }
  }, [o.isReady]);
  const s = (e) => {
    g.updateRegistrationFlow({
      flow: String(t == null ? void 0 : t.id),
      updateRegistrationFlowBody: e
    }).then(() => {
      o.push("/");
    }).catch(i);
  };
  return t ? /* @__PURE__ */ a(L, { children: /* @__PURE__ */ a(
    "div",
    {
      className: "log",
      style: { height: "85vh" },
      children: /* @__PURE__ */ a(
        k,
        {
          flowType: "registration",
          flow: t,
          additionalProps: {
            loginURL: "/ui/login"
          },
          includeScripts: !0,
          onSubmit: ({ body: e }) => s(e),
          cardImage: "https://storage.googleapis.com/bac-gcs-production/4e4ca2261e1d38fc07bb3b99f23d260262e115eba6d6f65c51c1d911de290a625413d9c6bbf186c580805f9f6783a5144186d86a4f52f1395b58ee373d554463.png"
        }
      )
    }
  ) }) : /* @__PURE__ */ a(F, {});
}, K = "/ui/login", I = "/ui/recovery", V = "/ui/registration", W = "/ui/logout", X = [K, I, V, W], E = $(void 0);
function ie({
  children: t,
  customTranslations: c
}) {
  const [o, u] = R(), r = B(), n = O(), i = (e) => P(void 0, void 0, "/ui/login")(e), h = async () => {
    try {
      const { data: e } = await g.createBrowserLogoutFlow();
      await g.updateLogoutFlow({
        token: e.logout_token
      }), u(void 0), n.push("/ui/login");
    } catch {
    }
  };
  _(() => {
    if (r == "/ui/logout" || r == "/ui/login" || r == "/ui/recovery" || r == "/ui/registration") {
      u(void 0);
      return;
    }
    g.toSession().then(({ data: e }) => {
      u(e);
    }).catch(i).catch((e) => e.message ? n.push(`/ui/error?error=${encodeURIComponent(e.message)}`) : n.push(`/ui/error?error=${encodeURIComponent(JSON.stringify(e))}`));
  }, [r]);
  const s = A(
    () => ({
      session: o,
      logOut: h
    }),
    [o]
  );
  return /* @__PURE__ */ U(E.Provider, { value: s, children: [
    /* @__PURE__ */ U(
      q,
      {
        customTranslations: c || {},
        locale: "en",
        defaultLocale: "en",
        children: [
          r == "/ui/login" && /* @__PURE__ */ a(Y, {}),
          r == I && /* @__PURE__ */ a(z, {}),
          r == "/ui/registration" && /* @__PURE__ */ a(D, {})
        ]
      }
    ),
    !X.includes(r) && o && t
  ] });
}
const ae = () => {
  const t = N(E);
  if (console.log(t), !t)
    throw new Error("useAuth must be used within an AuthProvider9");
  return t;
};
export {
  ie as OryAuthGateway,
  ae as useOry
};
