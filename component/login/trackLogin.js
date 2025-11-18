import { LivixElement, createStore } from "/component/livix-core.js";
import { CONST } from "./const.js";

// Optional: Global store (currently a placeholder, can be used later for SPA)
export const trackStore = createStore({
  user: null,
  order: null,
});

// Login component
class TrackLogin extends LivixElement {
  static attrs = [];

  connect() {
    // Make only loading / error reactive to avoid re-rendering on input
    this.property({
      loading: false,
      error: "",
    });

    this.username = "";
    this.password = "";
    this.track_id = "";

    this.applyStyles(CONST.styleAddr);
  }

  async handleSubmit(e) {
    e?.preventDefault();

    const root = this.shadowRoot;
    const form = root.querySelector("form");
    if (!form) return;

    const username = form.querySelector('input[name="username"]').value.trim();
    const password = form.querySelector('input[name="password"]').value.trim();
    const track_id = form.querySelector('input[name="track_id"]').value.trim();

    this.loading = true;
    this.error = "";

    try {
      const resp = await fetch(CONST.loginApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, track_id }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || !data.success) {
        this.error = data.msg || CONST.loginErr;
        return;
      }

      trackStore.setState({
        user: data.user || { name: username },
        order: data.order,
      });

      const ordersStr = encodeURIComponent(JSON.stringify(data.order));
      window.location.href = `/dashboard?orders=${ordersStr}`;
    } catch (err) {
      console.error(err);
      this.error = CONST.networkErr;
    } finally {
      this.loading = false;
    }
  }

  leftPanel(){
    return`
        <div class="left-panel">
          <div>
            <div class="brand">
              <div class="brand-logo">📦</div>
              <div>
                <div class="brand-text-title">TrackEase Express</div>
                <div class="brand-text-sub">Internal Tracking Console</div>
              </div>
            </div>

            <div class="hero-title">${CONST.heroTitle}</div>

            <div class="hero-desc">${CONST.heroDesc}</div>

            <div class="timeline">
              <div class="timeline-line"></div>
              <div class="timeline-steps">
                <div>
                  <div class="timeline-step-label">${CONST.timelineOrderSuccess}</div>
                  <div class="timeline-step-sub">${CONST.timelineSubOrderSuccess}</div>
                </div>
                <div>
                  <div class="timeline-step-label">${CONST.timelineOrderTransit}</div>
                  <div class="timeline-step-sub">${CONST.timelineSubOrderTransit}</div>
                </div>
                <div>
                  <div class="timeline-step-label">${CONST.timelineOrderDelivered}</div>
                  <div class="timeline-step-sub">${CONST.timelineSubOrderDelivered}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="foot-note">${CONST.footNote}</div>
        </div>
    `;
  }

  rightPanel(){
    const disabledAttr = this.loading ? CONST.disabled : "";
    const buttonText = this.loading ? CONST.verifying : CONST.loginDashboard;
    return `
        <div class="right-panel">
          <div class="panel-title">${CONST.panelTitle}</div>
          <div class="panel-sub">${CONST.panelSub}</div>

          <form>
            <div>
              <label>
                ${CONST.username}
                <input
                  name="username"
                  type="text"
                  placeholder=${CONST.usernamePlaceholder}
                />
              </label>
            </div>

            <div>
              <label>
                ${CONST.password}
                <input
                  name="password"
                  type="password"
                  placeholder=${CONST.passwordPlaceholder}
                />
              </label>
            </div>

            <div>
              <label>
                ${CONST.trackId}
                <input
                  name="track_id"
                  type="text"
                  placeholder=${CONST.trackIdPlaceholder}
                />
              </label>
            </div>

            <button class="btn-submit" type="submit" ${disabledAttr}>
              ${buttonText}
            </button>

            <div class="error">${this.error || ""}</div>
          </form>
        </div>
    `;
  }

  render() {
    return `
      <div class="container">
        ${this.leftPanel()}
        ${this.rightPanel()}
      </div>
    `;
  }

  didrender() {
    const form = this.shadowRoot.querySelector("form");
    if (form) {
      form.onsubmit = (e) => this.handleSubmit(e);
    }
  }
}

customElements.define("track-login", TrackLogin);
