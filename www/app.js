var content = document.getElementById("content");
var jobs;

function renderJobList() {
  var html = "";
  jobs.forEach(function (job) {
    html = html + '<div class="row">' + renderJob(job) + "</div>";
  });
  content.innerHTML = html;
}

function renderJob(job, isAnimated) {
  return `
        <div class="col-sm-12">
            <div class="panel panel-primary ${isAnimated ? "animateIn" : ""}">
                <div class="panel-heading">Mux Job ID: ${job.muxJobId}</div>
                <div class="panel-body">
                    <div class="col-md-12 col-lg-7">
                        <table>
                            <tr>
                                <td class="panel-table-label">Amount:</td><td>${
                                  job.amount
                                }</td>
                            </tr>
                        </table>
                    </div>   
                    <div class="col-md-12 col-lg-5">
                        <button class="btn btn-info" onclick="sendMuxInbound('${
                          job.muxJobId
                        }')">
                            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                            Send Mux Inbound
                        </button>
                        <button class="btn btn-info" onclick="sendMuxJobStatus('${
                          job.muxJobId
                        }')">
                            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                            Send Mux Status
                        </button>
                    </div>
                    <div id="details-${job.muxJobId}" class="col-md-12"></div>
                </div>
            </div>
        </div>`;
}

// Render the details for a job
/*function renderJobDetails(job, items) {
  var html = `
        <table class="table">
            <tr>
                <th colspan="2">Job Detail 1?</th>
                <th colspan="2">Job Detail 2?</th>
            </tr>`;
  items.forEach(function (item) {
    html =
      html +
      `
            <tr>
                <td>${item.jobDetailLine1}</td>
                <td>${item.jobDetailLine2}</td>
            </tr>`;
  });
  html = html + "</table>";
  var details = document.getElementById("details-" + job.muxJobId);
  details.innerHTML = html;
}*/

function deleteMux(muxJobId) {
  var index = jobs.length - 1;
  while (index >= 0) {
    if (jobs[index].muxJobId === muxJobId) {
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
    if (job.muxJobId == newMux.muxJobId) {
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

// Retrieve the existing list of jobs from Node server
function getJobList() {
  var xhr = new XMLHttpRequest(),
    method = "GET",
    url = "/mux-jobs";

  xhr.open(method, url, true);
  xhr.onload = function () {
    jobs = JSON.parse(xhr.responseText);
    renderJobList();
  };
  xhr.send();
}

// Retrieve the merchandise list for a mix from Node server
/*function getMuxDetails(muxJobId) {
  var details = document.getElementById("details-" + muxJobId);
  if (details.innerHTML != "") {
    details.innerHTML = "";
    return;
  }
  var mux;
  for (var i = 0; i < jobs.length; i++) {
    if ((jobs[i].muxJobId = muxJobId)) {
      mux = jobs[i];
      break;
    }
  }
  var xhr = new XMLHttpRequest(),
    method = "GET",
    url = "/jobs/" + muxJobId;

  xhr.open(method, url, true);
  xhr.onload = function () {
    var items = JSON.parse(xhr.responseText);
    renderJobDetails(mix, items);
  };
  xhr.send();
}*/

// Post inbound message to Node server
function sendMuxInbound(jobId) {
  var xhr = new XMLHttpRequest(),
    method = "POST",
    url = "/send-inbound/" + jobId;

  xhr.open(method, url, true);
  xhr.onload = function () {
    deleteMux(jobId);
    renderJobList();
  };
  xhr.send();
}

// Post status message to Node server
function sendMuxJobStatus(jobId) {
  var xhr = new XMLHttpRequest(),
    method = "POST",
    url = "/send-status/" + jobId;

  xhr.open(method, url, true);
  xhr.onload = function () {
    deleteMux(jobId);
    renderJobList();
  };
  xhr.send();
}

getJobList();
