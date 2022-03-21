//
let all_readings = [];

const data = {
  type: "line",
  options: {
    elements: {
      point: {
        radius: 0,
      },
    },
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

const input = document.querySelector("input");
const ol = document.querySelector("ol");
const actx = document.getElementById("analyticChart").getContext("2d");

const aChart = new Chart(actx, data);

const updateData = ({ gammas, betas, devs, sums, secs, alphas }) => {
  const timely = (dataArr) => dataArr.map((y, i) => ({ x: secs[i], y }));

  aChart.data.datasets[0].data = timely(gammas);
  aChart.data.datasets[1].data = timely(betas);
  aChart.data.datasets[2].data = timely(devs);
  aChart.data.datasets[3].data = timely(sums);
  aChart.data.datasets[4].data = timely(alphas);
  aChart.data.labels = secs.map((i) => new Date(i).getSeconds());
  aChart.update();
};

const renderList = (readings) =>
  readings.map((field) => {
    // create a list object
    const li = document.createElement("li");
    li.innerText = field;

    // render chart onclick
    li.onclick = () =>
      fetch(
        `https://salah-inspector-default-rtdb.firebaseio.com/charts/${field}.json`
      )
        .then((res) => res.json())
        .then(updateData);

    // Set styles
    Object.assign(li.style, {
      color: "skyblue",
      textDecoration: "underline",
      fontSize: "larger",
      cursor: 'pointer'
    });

    ol.appendChild(li);
  });

const renderFields = () =>
  fetch(
    "https://salah-inspector-default-rtdb.firebaseio.com/charts/fields.json"
  )
    .then((r) => r.json())
    .then((readings) => {
      all_readings = readings;
      renderList(readings);
    })
    .catch((e) => alert(e));

input.onkeyup = () => {
  if (!input.value) {
    document.querySelectorAll("li").forEach((el) => el.remove());
    renderList(all_readings);
  } else
    document.querySelectorAll("li").forEach((el) => {
      if (!el.innerText.includes(input.value)) el.remove();
    });
};

renderFields();
