// component/dashboard/trackDashboard.js
import { LivixElement } from "/component/livix-core.js";
import { CONST } from "./const.js";

// Dashboard Component
class TrackDashboard extends LivixElement {
  static attrs = [];

  connect() {
    this.property({
      order: null,
    });

    // Read ?order / ?orders from the URL
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("order") || params.get("orders");

    if (raw) {
      try {
        const parsed = JSON.parse(decodeURIComponent(raw));
        this.order = parsed;
      } catch (e) {
        console.error(CONST.orderErr, e);
      }
    }
    this.applyStyles(CONST.styleAddr);
  }

  summaryCard(order, statusClass, isTransit, isDelivered){
    console.log(isTransit, isDelivered, statusClass)
    const status = isTransit
      ? "In Transit"
      : isDelivered
      ? "Delivered"
      : "Order Created";

    return`
        <div class="summary-card">
          <div class="summary-main">
            <div class="summary-title-row">
              <div class="summary-title">Order Details</div>
              <span class="${statusClass}">
                ${status}
              </span>
            </div>
            <div class="summary-sub">${CONST.summarySub}</div>

            <div class="summary-grid">
              <div>
                <div class="field-label">${CONST.trackId}</div>
                <div class="field-value">${order.orderId || "-"}</div>
              </div>
              <div>
                <div class="field-label">${CONST.recipient}</div>
                <div class="field-value">${order.recipient || "-"}</div>
              </div>
              <div>
                <div class="field-label">${CONST.product}</div>
                <div class="field-value">${order.product || "-"}</div>
              </div>
              <div>
                <div class="field-label">${CONST.address}</div>
                <div class="field-value">${order.address || "-"}</div>
              </div>
              <div>
                <div class="field-label">${CONST.contact}</div>
                <div class="field-value">${order.phone || "-"}</div>
              </div>
            </div>
          </div>

          <div class="summary-side">
            <div class="timeline-label">${CONST.timelineTitle}</div>

            <div class="timeline-item">
              <div class="dot active"></div>
              <div>
                <div class="timeline-text-main">${CONST.timelineOrderSuccess}</div>
                <div class="timeline-text-sub">${CONST.timelineSubOrderSuccess}</div>
              </div>
            </div>

            <div class="timeline-item">
              <div class="dot ${isTransit || isDelivered ? "active" : "inactive"}"></div>
              <div>
                <div class="timeline-text-main">${CONST.timelineOrderTransit}</div>
                <div class="timeline-text-sub">${CONST.timelineSubOrderTransit}</div>
              </div>
            </div>

            <div class="timeline-item">
              <div class="dot ${isDelivered ? "active" : "inactive"}"></div>
              <div>
                <div class="timeline-text-main">${CONST.timelineOrderDelivered}</div>
                <div class="timeline-text-sub">${CONST.timelineSubOrderDelivered}</div>
              </div>
            </div>
          </div>
        </div>
    `;
  }

  orderList(order){
    return`
        <h2>📋 ${CONST.orderLs}</h2>
        <table>
          <thead>
            <tr>
              <th>${CONST.trackId}</th>
              <th>${CONST.recipient}</th>
              <th>${CONST.product}</th>
              <th>${CONST.address}</th>
              <th>${CONST.contact}</th>
              <th>${CONST.status}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${order.orderId || ""}</td>
              <td>${order.recipient || ""}</td>
              <td>${order.product || ""}</td>
              <td>${order.address || ""}</td>
              <td>${order.phone || ""}</td>
              <td>${order.status || ""}</td>
            </tr>
          </tbody>
        </table>`;
  }

  render() {
    const order = this.order || {};
    const status = (order.status || "").toLowerCase();

    const isTransit = ! status.includes("order create");
    const isDelivered = status.includes("delivered");

    const statusClass = isDelivered
      ? "status-pill delivered"
      : isTransit
      ? "status-pill in-transit"
      : "status-pill default";

    return `
      <div class="page">
        <div class="top-bar">
          <div class="brand">
            <div class="brand-logo">📦</div>
            <div>
              <div class="brand-title">${CONST.brandTitle}</div>
              <div class="brand-sub">${CONST.brandSub}</div>
            </div>
          </div>
          <a class="back-link" href="/login">← Back</a>
        </div>

        ${this.summaryCard(order, statusClass, isTransit, isDelivered)}
        ${this.orderList(order)}

      </div>
    `;
  }
}

customElements.define("track-dashboard", TrackDashboard);
