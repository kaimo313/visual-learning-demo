! function (r) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = r();
    else if ("function" == typeof define && define.amd) define([], r);
    else {
        var n;
        n = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ?
            self : this, n.BezierEasing = r()
    }
}(function () {
    return function r(n, e, t) {
        function o(u, i) {
            if (!e[u]) {
                if (!n[u]) {
                    var a = "function" == typeof require && require;
                    if (!i && a) return a(u, !0);
                    if (f) return f(u, !0);
                    var c = new Error("Cannot find module '" + u + "'");
                    throw c.code = "MODULE_NOT_FOUND", c
                }
                var d = e[u] = {
                    exports: {}
                };
                n[u][0].call(d.exports, function (r) {
                    var e = n[u][1][r];
                    return o(e || r)
                }, d, d.exports, r, n, e, t)
            }
            return e[u].exports
        }
        for (var f = "function" == typeof require && require, u = 0; u < t.length; u++) o(t[u]);
        return o
    }({
        1: [function (r, n, e) {
            function t(r, n) {
                return 1 - 3 * n + 3 * r
            }

            function o(r, n) {
                return 3 * n - 6 * r
            }

            function f(r) {
                return 3 * r
            }

            function u(r, n, e) {
                return ((t(n, e) * r + o(n, e)) * r + f(n)) * r
            }

            function i(r, n, e) {
                return 3 * t(n, e) * r * r + 2 * o(n, e) * r + f(n)
            }

            function a(r, n, e, t, o) {
                var f, i, a = 0;
                do {
                    i = n + (e - n) / 2, f = u(i, t, o) - r, f > 0 ? e = i : n = i
                } while (Math.abs(f) > l && ++a < p);
                return i
            }

            function c(r, n, e, t) {
                for (var o = 0; o < d; ++o) {
                    var f = i(n, e, t);
                    if (0 === f) return n;
                    n -= (u(n, e, t) - r) / f
                }
                return n
            }
            var d = 4,
                l = 1e-7,
                p = 10,
                s = 11,
                v = 1 / (s - 1),
                y = "function" == typeof Float32Array;
            n.exports = function (r, n, e, t) {
                function o(n) {
                    for (var t = 0, o = 1, u = s - 1; o !== u && f[o] <= n; ++o) t += v;
                    --o;
                    var d = (n - f[o]) / (f[o + 1] - f[o]),
                        l = t + d * v,
                        p = i(l, r, e);
                    return p >= .001 ? c(n, l, r, e) : 0 === p ? l : a(n, t, t + v, r, e)
                }
                if (!(0 <= r && r <= 1 && 0 <= e && e <= 1)) throw new Error(
                    "bezier x values must be in [0, 1] range");
                var f = y ? new Float32Array(s) : new Array(s);
                if (r !== n || e !== t)
                    for (var d = 0; d < s; ++d) f[d] = u(d * v, r, e);
                return function (f) {
                    return r === n && e === t ? f : 0 === f ? 0 : 1 === f ? 1 : u(o(f), n,
                        t)
                }
            }
        }, {}]
    }, {}, [1])(1)
});