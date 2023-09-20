// @ts-nocheck

import React, { useEffect } from "react";

const Mobi2GoStorefront = () => {
  useEffect(() => {
    // The embedded script functionality
    (function (s) {
      var d = document,
        m2g = d.createElement("script"),
        l = function () {
          Mobi2Go.load(s.container, s.ready);
        },
        jq =
          window.jQuery &&
          +window.jQuery.fn.jquery.replace(/^(\d+).*$/, "$1") === 1 &&
          +window.jQuery.fn.jquery.replace(/^\d+\.(\d+).*$/, "$1") >= 7,
        qs = window.location.search.substring(1),
        re = "=(.*?)(?:;|$)",
        c = d.cookie.match("MOBI2GO_SESSIONID" + re),
        w = window.innerWidth;
      m2g.src =
        "https://www.mobi2go.com/store/embed/lasttraintoparis.js?" +
        qs +
        (jq ? "&no_jquery" : "") +
        (c ? "&s=" + c[1] : "") +
        "&device_width=" +
        w;
      if (m2g.onload !== undefined) m2g.onload = l;
      else
        m2g.onreadystatechange = function () {
          if (m2g.readyState !== "loaded" && m2g.readyState !== "complete") return;
          m2g.onreadystatechange = null;
          l();
        };
      window.Mobi2Go_est = +new Date();
      document.getElementsByTagName("head")[0].appendChild(m2g);
    })({
      container: "Mobi2Go-Storefront",
      ready: function () {},
    });
  }, []); // The empty array means this useEffect will run once when the component mounts.

  return <div id="Mobi2Go-Storefront">{/* This is where the Mobi2Go app will inject its UI */}</div>;
};

export default Mobi2GoStorefront;
