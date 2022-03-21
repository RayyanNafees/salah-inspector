//

const timely = (dataArr) => dataArr.map((y, i) => ({ x: secs[i], y }));

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
    labels: secs.map((i) => new Date(i).getSeconds()),
    datasets: [
      {
        label: "Gamma (X)",
        data: timely(gammas),
        fill: false,
        borderColor: "red",
        tension: 0.1,
      },
      {
        label: "Beta (Y)",
        data: timely(betas),
        fill: false,
        borderColor: "yellow",
        tension: 0.1,
      },
      {
        label: "Deviation",
        data: timely(devs),
        fill: false,
        borderColor: "blue",
        tension: 0.01,
      },
      {
        label: "Sum",
        data: timely(sums),
        fill: false,
        borderColor: "purple",
        tension: 0.01,
      },
      {
        label: "Alpha",
        data: timely(alphas),
        fill: false,
        borderColor: "green",
        tension: 0.1,
      },
    ],
  },
};

const ctx = document.getElementById("myChart").getContext("2d");
const _start = document.getElementById("starter");

const aChart = new Chart(ctx, data);

_start.onclick = () => {
  let intrv;

  if (!started) {
    if (first_start) {
      aChart.data.datasets[0].data = [];
      aChart.data.datasets[1].data = [];
      aChart.data.datasets[2].data = [];
      aChart.data.datasets[3].data = [];
      aChart.data.datasets[4].data = [];
      aChart.data.labels = [];
      aChart.update();
    }
    started = true;

    setTimeout(() => {
      Beep(600, 400);
      intrv = setInterval(() => {
        aChart.data.datasets[0].data = timely(gammas);
        aChart.data.datasets[1].data = timely(betas);
        aChart.data.datasets[2].data = timely(devs);
        aChart.data.datasets[3].data = timely(sums);
        aChart.data.datasets[4].data = timely(alphas);
        aChart.data.labels = secs.map((i) => new Date(i).getSeconds());
        aChart.update();
      }, 10);
    }, 500);
  } else {
    started = false;
    clearInterval(intrv);
    first_start = true;
  }
  _start.innerHTML = started ? "Stop" : "Start";
};

// store data
const send = document.getElementById("upload");

send.onclick = () => {
  const field = prompt("Field Name: ");
  if (field && field !== "fields") {
    fetch(
      `https://salah-inspector-default-rtdb.firebaseio.com/charts/${field}.json`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          time: Date(),
          gammas,
          betas,
          secs,
          sums,
          devs,
          alphas,
        }),
      }
    )
      .then(async () =>
        fetch(
          `https://salah-inspector-default-rtdb.firebaseio.com/charts/fields.json`,
          {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(
              (
                (await fetch(
                  `https://salah-inspector-default-rtdb.firebaseio.com/charts/fields.json`
                ).then((r) => r.json())) || []
              ).concat([field])
            ),
          }
        ).then((r) => alert("Success ! " + r.status))
      )
      .catch((e) => alert("Error: " + e));
  }
};
