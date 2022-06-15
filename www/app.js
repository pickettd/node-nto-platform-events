var content = document.getElementById("content");
var jobs;

function renderMuxList() {
  var html = "";
  jobs.forEach(function (mux) {
    html = html + '<div class="row">' + renderMux(mux) + "</div>";
  });
  content.innerHTML = html;
}

function renderMux(mux, isAnimated) {
  return `
        <div class="col-sm-12">
            <div class="panel panel-primary ${isAnimated ? "animateIn" : ""}">
                <div class="panel-heading">Mux Job ID: ${mux.msgId}</div>
                <div class="panel-body">
                    <div class="col-md-12 col-lg-7">
                        <table>
                            <tr>
                                <td class="panel-table-label">Amount:</td><td>${
                                  mux.amount
                                }</td>
                            </tr>
                        </table>
                    </div>   
                    <div class="col-md-12 col-lg-5">
                        <button class="btn btn-info" onclick="approveMux('${
                          mux.msgId
                        }')">
                            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                            Mark Complete
                        </button>
                    </div>
                    <div id="details-${mux.msgId}" class="col-md-12"></div>
                </div>
            </div>
        </div>`;
}

// Render the details for a mux
/*function renderMuxDetails(mux, items) {
  var html = `
        <table class="table">
            <tr>
                <th colspan="2">Product</th>
                <th>MSRP</th>
                <th>Qty</th>
            </tr>`;
  items.forEach(function (item) {
    html =
      html +
      `
            <tr>
                <td><img src="${item.pictureURL}" style="height:50px"/></td>
                <td>${item.productName}</td>
                <td>$${item.price}</td>
                <td>${item.qty}</td>
            </tr>`;
  });
  html = html + "</table>";
  var details = document.getElementById("details-" + mux.msgId);
  details.innerHTML = html;
}*/

function deleteMux(msgId) {
  var index = jobs.length - 1;
  while (index >= 0) {
    if (jobs[index].msgId === msgId) {
      jobs.splice(index, 1);
    }
    index -= 1;
  }
}

var socket = io.connect();

socket.on("mux_outbound", function (newMux) {
  // if the mix is alresdy in the list: do nothing
  var exists = false;
  jobs.forEach((job) => {
    if (job.msgId == newMux.msgId) {
      exists = true;
    }
  });
  // if the mix is not in the list: add it
  if (!exists) {
    jobs.push(newMux);
    var el = document.createElement("div");
    el.className = "row";
    el.innerHTML = renderMix(newMux, true);
    content.insertBefore(el, content.firstChild);
  }
});

/*socket.on("mix_unsubmitted", function (data) {
  deleteMux(data.msgId);
  renderMixList();
});*/

// Retrieve the existing list of jobs from Node server
function getMuxList() {
  var xhr = new XMLHttpRequest(),
    method = "GET",
    url = "/mux-jobs";

  xhr.open(method, url, true);
  xhr.onload = function () {
    jobs = JSON.parse(xhr.responseText);
    renderMuxList();
  };
  xhr.send();
}

// Retrieve the merchandise list for a mix from Node server
/*function getMuxDetails(msgId) {
  var details = document.getElementById("details-" + msgId);
  if (details.innerHTML != "") {
    details.innerHTML = "";
    return;
  }
  var mux;
  for (var i = 0; i < jobs.length; i++) {
    if ((jobs[i].msgId = msgId)) {
      mux = jobs[i];
      break;
    }
  }
  var xhr = new XMLHttpRequest(),
    method = "GET",
    url = "/jobs/" + msgId;

  xhr.open(method, url, true);
  xhr.onload = function () {
    var items = JSON.parse(xhr.responseText);
    renderMuxDetails(mix, items);
  };
  xhr.send();
}*/

// Post approve message to Node server
function approveMux(msgId) {
  var xhr = new XMLHttpRequest(),
    method = "POST",
    url = "/approvals/" + msgId;

  xhr.open(method, url, true);
  xhr.onload = function () {
    deleteMux(msgId);
    renderMuxList();
  };
  xhr.send();
}

getMuxList();
