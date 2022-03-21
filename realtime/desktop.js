const data = {
  type: "line",
  options: {
    elements: {
      point: {
        radius: 0,
      },
    },
    animation: false,
  },
  data: {
    labels: [],
    datasets: [
      {
        label: "Gamma (X)",
        data: [],
        fill: false,
        borderColor: "red",
        tension: 0.1,
      },
      {
        label: "Beta (Y)",
        data: [],
        fill: false,
        borderColor: "yellow",
        tension: 0.1,
      },
      {
        label: "Deviation",
        data: [],
        fill: false,
        borderColor: "blue",
        tension: 0.01,
      },
      {
        label: "Sum",
        data: [],
        fill: false,
        borderColor: "purple",
        tension: 0.01,
      },
      {
        label: "Alpha",
        data: [],
        fill: false,
        borderColor: "green",
        tension: 0.1,
      },
    ],
  },
};

const actx = mobile
  ? document.createElement("canvas").getContext("2d")
  : document.getElementById("realtimeChart")?.getContext("2d");

const aChart = new Chart(actx, data);

const updateData = ({ gamma, beta, dev, sum, sec, alpha }) => {
  const timely = (data) => ({ x: sec, data });

  aChart.data.datasets[0].data.push(timely(gamma));
  aChart.data.datasets[1].data.push(timely(beta));
  aChart.data.datasets[2].data.push(timely(dev));
  aChart.data.datasets[3].data.push(timely(sum));
  aChart.data.datasets[4].data.push(timely(alpha));
  aChart.data.labels.push(new Date(sec).getSeconds());
  aChart.update();
};

const emptyData = () => {
  aChart.data.datasets[0].data = [];
  aChart.data.datasets[1].data = [];
  aChart.data.datasets[2].data = [];
  aChart.data.datasets[3].data = [];
  aChart.data.datasets[4].data = [];

  aChart.data.labels = [];
  aChart.update();
};

socket.on("output", (data) => {
  console.log(data);
  updateData(data);
}); // occurs on dekstop only
socket.on("empty", emptyData); // occurs on desktop only

const _start = document.getElementById("starter");
const _send = document.getElementById("upload");

_start.onclick = () => {
  if (!started) {
    if (first_start) {
      socket.emit("empty all"); // occurs on mobile
    }
    started = true;
  } else {
    started = false;
    first_start = true;
  }
  _start.innerHTML = started ? "Stop" : "Start";
};

_send.onclick = () => {
  const msg = prompt("Message: ");
  if (msg) socket.emit("input", msg);
};
