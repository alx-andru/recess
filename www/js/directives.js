'use strict';
var colors = {
  background: '#0d0307',
  white: '#fefefe',
  black: '#232323',
  darkgray: '#444444',
  turquoise: '#1abc9c',
  greensea: '#16a085',
  emerald: '#2ecc71',
  nephritis: '#27ae60',
  peterriver: '#3498db',
  belizehole: '#2980b9',
  amethyst: '#9b59b6',
  wisteria: '#8e44ad',
  wetasphalt: '#34495e',
  midnightblue: '#2c3e50',
  sunflower: '#f1c40f',
  oranje: '#f39c12',
  carrot: '#e67e22',
  pumpkin: '#d35400',
  alizarin: '#e74c3c',
  pomegranate: '#c0392b',
  clouds: '#ecf0f1',
  silver: '#bdc3c7',
  concrete: '#95a5a6',
  deepsilver: '#969990',
  asbestos: '#7f8c8d',
  inactive: '#898989'
};

var colororder = [
  colors.pomegranate, // 0-20
  colors.pumpkin, // 20-40
  colors.oranje, // 40-60
  colors.sunflower, // 60-80
  colors.greensea, // 80-90
  colors.emerald, // 90 - 100
  colors.nephritis // 100+
];

var primary_steps = colors.nephritis;
var primary_active = colors.belizehole;

var directives = angular.module('recess.directives', []);

directives.config(function () {
  // configuration
});

directives.directive('footer', function () {
  return {
    scope: {
      isMessengerActive: '=messengerActive',
      isActivityActive: '=activityActive',
      isGoalActive: '=goalActive',
    },
    templateUrl: 'templates/footer.html',
    link: function (scope, element) {
      scope.isAndroid = ionic.Platform.isAndroid();

    }
  }
});

directives.directive('uiChartStepsToday', function () {
  return {
    scope: {
      steps: '=chartDataSteps',
      goal: '=chartDataGoal',
    },
    templateUrl: 'templates/ui-chart-steps-today.html',
    link: function (scope, element) {
      console.log('Steps in directive: ' + scope.steps);
      console.log('Goal in directive: ' + scope.goal);

      if (scope.steps === undefined) {
        scope.steps = 0;
      }
      if (scope.goal === undefined || scope.goal === 0) {
        scope.goal = 10000;
      }


      scope.chart = {
        today: {
          data: [scope.steps, scope.goal - scope.steps],
          labels: ['Steps', 'Goal'],
          dataset: {
            backgroundColor: [primary_steps, colors.clouds,],
            borderWidth: [0, 0,],
            hoverBackgroundColor: [primary_steps, colors.clouds,],
            hoverBorderWidth: [0, 0,]
          },
          options: {
            circumference: Math.PI,
            rotation: Math.PI,
            cutoutPercentage: 94,
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
              enabled: false
            },
            hover: {
              mode: 'label'
            }
          }
        },
      };

      scope.$watch('steps', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          console.log('steps updated from: ' + oldValue + ' to: ' + newValue);
          scope.steps = newValue;
          // update chart data manually
          scope.chart.today.data = [scope.steps, scope.goal - scope.steps];
        }
      }, true);
      scope.$watch('goal', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          console.log('goal updated from: ' + oldValue + ' to: ' + newValue);
          scope.goal = newValue;
          console.log('new value for goal');
        }
      }, true);

    }
  };
});

directives.directive('uiChartActivityToday', function ($moment, _) {
  return {
    scope: {
      active: '=chartDataActive',
      goal: '=chartDataGoal',
      total: '=labelDataTotal',
    },
    templateUrl: 'templates/ui-chart-activity-today.html',
    link: function (scope, element) {

      var labels = [];
      var steps = [];

      var goalData = [];
      var bgColor = [];
      for (var i = 0; i < 24; i++) {

        if (i === 12) {
          labels.push('noon');
        } else {
          labels.push($moment.utc().startOf('day').add(i, 'hours').format('HH'));
        }

        steps.push(100);

        bgColor.push(primary_active);
        goalData.push(scope.goal);
      }


      if (scope.active === undefined || scope.active.length === 0) {
        scope.active = [60, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 60]; // init
        scope.goal = 250;
      }
      if (scope.total === undefined) {
        scope.total = 0;
      }

      scope.chart = {
        day: {
          labels: labels,
          data: [
            scope.active,
            //  goalData,
          ],
          dataset: [
            {
              backgroundColor: bgColor,
              label: "Steps per hour",
              borderWidth: 0,
              type: 'bar',
              hoverBackgroundColor: colors.black,
            },
            {
              borderColor: '#3498db',
              fill: false,
              pointRadius: 0,
              label: "Goal per hour",
              borderWidth: 10,
              //hoverBackgroundColor: "rgba(255,99,132,0.4)",
              //hoverBorderColor: "rgba(255,99,132,1)",
              type: 'line'
            }
          ],
          options: {
            //circumference: Math.PI,
            //rotation: Math.PI,
            //cutoutPercentage: 90,
            multiTooltipTemplate: '<%=datasetLabel%> - <%=value%>',
            scaleBeginAtZero: true,
            barBeginAtOrigin: true,
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                // Any unspecified dimensions are assumed to be 0
                left: 0,
                //bottom: 25
              }
            },
            scales: {
              xAxes: [{
                afterTickToLabelConversion: function (data) {
                  var xLabels = data.ticks;
                  xLabels.forEach(function (labels, i) {
                    if (!(i == 0 || i == 12 || i == 23)) {
                      xLabels[i] = '';
                    }
                  });
                },
                display: false,
                paddingBottom: 10,
                barThickness: 8,
                ticks: {
                  beginAtZero: true,
                  maxRotation: 0,
                  minRotation: 0,
                  labelOffset: 0,
                  padding: 20,

                },
                gridLines: {
                  display: false,
                  lineWidth: 0,
                  color: 'rgba(255,255,255,0)',
                  offsetGridLines: true,
                },

              }],
              yAxes: [{

                display: false,
                gridLines: {
                  display: false,
                  lineWidth: 0,
                  color: 'rgba(255,255,255,0)',
                },
                ticks: {
                  beginAtZero: true,
                  min: 1,
                  max: 60
                }
              }]
            },
            tooltips: {
              mode: 'x-axis',
              //backgroundColor: 'black',
              enabled: false,

              custom: function (tooltip) {
                // tooltip will be false if tooltip is not visible or should be hidden
                if (!tooltip.body) {
                  console.log('not tooltip');

                  $('.chart-activity-today-tooltip__display').addClass('chart-activity-today-tooltip__display--hidden');
                  return;
                }
                console.log(tooltip);

                if (tooltip.body.length == 1 && tooltip.body[0] !== undefined) {
                  $('.chart-activity-today-tooltip__display').find('.value').html(Math.ceil(tooltip.dataPoints[0].yLabel));
                  $('.chart-activity-today-tooltip__display').find('.hour').html(tooltip.dataPoints[0].index);
                  $('.chart-activity-today-tooltip__display').removeClass('chart-activity-today-tooltip__display--hidden');

                }

              },
              callbacks: {
                beforeTitle: function () {
                  return '';
                },
                afterTitle: function () {
                  return '';
                },
                beforeBody: function () {
                  return '';
                },
                afterBody: function () {
                  return '';
                },
                beforeLabel: function () {
                  return '';
                },
                label: function (tooltipItem, data) {
                  return tooltipItem.yLabel;
                },
                afterLabel: function () {
                  return 'steps';
                },
                beforeFooter: function () {
                  return '';
                },
                footer: function () {
                  return '';
                },
                afterFooter: function () {
                  return '';
                },
              }
            },
            hover: {
              mode: 'label'
            },
          }
        }
      };

      scope.$watch('active', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          scope.active = newValue;
          // update chart data manually
          scope.chart.day.data[0] = scope.active;
        }
      }, true);

      scope.$watch('total', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          scope.total = newValue;
        }
      }, true);

    }
  };
});

directives.directive('uiChartStepsWeek', function ($moment, _) {
  return {
    scope: {
      steps: '=chartDataSteps',
      goal: '=chartDataGoal',
    },
    templateUrl: 'templates/ui-chart-steps-week.html',
    link: function (scope, element) {

      var labels = [];
      var bgColors = [];
      for (var i = 6; i >= 0; i--) {

        if (i == 0) {
          labels.push('Today');
        } else {
          labels.push($moment.utc().subtract(i, 'days').format('dd'));
        }

        bgColors.push(primary_steps);
      }

      if (scope.steps === undefined || scope.steps.length === 0) {
        scope.steps = [18000, 400, 400, 400, 400, 400, 18000]; // init
        scope.goal = 10000;

      }

      scope.chart = {
        week: {
          data: scope.steps,
          labels: labels,
          dataset: {
            backgroundColor: bgColors,
            borderWidth: 0,
            hoverBackgroundColor: colors.black,
          },
          options: {
            //circumference: Math.PI,
            //rotation: Math.PI,
            //cutoutPercentage: 90,
            multiTooltipTemplate: '<%=datasetLabel%> - <%=value%>',
            scaleBeginAtZero: true,
            barBeginAtOrigin: true,
            scales: {
              xAxes: [{
                display: false,
                ticks: {
                  beginAtZero: true
                },
                gridLines: {
                  display: false,
                  lineWidth: 0,
                  color: 'rgba(255,255,255,0)',
                }
              }],
              yAxes: [{
                display: false,
                gridLines: {
                  display: false,
                  lineWidth: 0,
                  color: 'rgba(255,255,255,0)',
                },
                ticks: {
                  beginAtZero: true,
                  min: 1,
                  max: 18000
                }
              }]
            },
            tooltips: {
              mode: 'x-axis',
              //backgroundColor: 'black',
              enabled: false,

              custom: function (tooltip) {
                // tooltip will be false if tooltip is not visible or should be hidden
                if (!tooltip.body) {
                  console.log('not tooltip');

                  $('.chart-steps-week-tooltip__display').addClass('chart-steps-week-tooltip__display--hidden');
                  return;
                }
                console.log(tooltip);

                if (tooltip.body.length == 1 && tooltip.body[0] !== undefined) {
                  $('.chart-steps-week-tooltip__display').find('.value').html(Math.ceil(tooltip.dataPoints[0].yLabel));
                  $('.chart-steps-week-tooltip__display').find('.day').html(tooltip.dataPoints[0].xLabel);
                  $('.chart-steps-week-tooltip__display').removeClass('chart-steps-week-tooltip__display--hidden');

                }

              },
              callbacks: {
                beforeTitle: function () {
                  return '';
                },
                afterTitle: function () {
                  return '';
                },
                beforeBody: function () {
                  return '';
                },
                afterBody: function () {
                  return '';
                },
                beforeLabel: function () {
                  return '';
                },
                label: function (tooltipItem, data) {
                  return tooltipItem.yLabel;
                },
                afterLabel: function () {
                  return 'steps';
                },
                beforeFooter: function () {
                  return '';
                },
                footer: function () {
                  return '';
                },
                afterFooter: function () {
                  return '';
                },
              }
            },
            hover: {
              mode: 'label'
            },
          }
        }
      };
      /* calculate color dependent on performance
       _.each(scope.steps, function (steps, idx) {
       scope.chart.week.dataset.backgroundColor[idx] = calculateColor(steps, scope.goal);
       });
       */

      scope.$watch('steps', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          scope.steps = newValue;
          // update chart data manually
          scope.chart.week.data = scope.steps;
          _.each(scope.steps, function (steps, idx) {
            scope.chart.week.dataset.backgroundColor[idx] = calculateColor(steps, scope.goal);
          });
        }
      }, true);

    }
  };
});


directives.directive('uiChartActivityWeek', function ($moment, _) {
  return {
    scope: {
      active: '=chartDataActive',
      goal: '=chartDataGoal',
      total: '=labelDataTotal',
    },
    templateUrl: 'templates/ui-chart-activity-week.html',
    link: function (scope, element) {

      var labels = [];


      var goalData = [];


      var bgColors = [];
      for (var i = 6; i >= 0; i--) {
        if (i == 0) {
          labels.push('Today');
        } else {
          labels.push($moment.utc().subtract(i, 'days').format('dd'));
        }
        bgColors.push(colors.clouds);
        goalData.push(scope.goal);

      }

      if (scope.active === undefined || scope.active.length === 0) {
        scope.active = [300, 20, 20, 20, 20, 20, 300];

      }
      if (scope.goal === undefined) {
        scope.goal = 100;
      }

      scope.chart = {
        week: {
          labels: labels,
          data: [
            scope.active,
            //goalData
          ],
          dataset: [
            {
              backgroundColor: colors.peterriver,
              label: "Steps per hour",
              borderWidth: 0,
              type: 'bar',
              hoverBackgroundColor: colors.black,
            },
            {
              borderColor: colors.peterriver,
              fill: false,
              pointRadius: 0,
              label: "Goal per hour",
              borderWidth: 2,
              //hoverBackgroundColor: "rgba(255,99,132,0.4)",
              //hoverBorderColor: "rgba(255,99,132,1)",
              type: 'line'
            }
          ],
          options: {
            customTooltips: function (tooltip) {
              console.log('custom Tooltips:');
              console.log(tooltip);
            },
            //circumference: Math.PI,
            //rotation: Math.PI,
            //cutoutPercentage: 90,
            multiTooltipTemplate: '<%=datasetLabel%> - <%=value%>',
            scaleBeginAtZero: true,
            barBeginAtOrigin: true,
            scales: {
              xAxes: [{
                afterTickToLabelConversion: function (data) {
                  var xLabels = data.ticks;

                },
                display: false,
                ticks: {
                  beginAtZero: true,
                  maxRotation: 0,
                  minRotation: 0
                },
                gridLines: {
                  display: false,
                  lineWidth: 0,
                  color: 'rgba(255,255,255,0)',
                }
              }],
              yAxes: [{

                display: false,
                gridLines: {
                  display: false,
                  lineWidth: 0,
                  color: 'rgba(255,255,255,0)',
                },
                ticks: {
                  beginAtZero: true,
                  min: 1,
                  max: 300
                }
              }]
            },
            tooltips: {
              mode: 'x-axis',
              //backgroundColor: 'black',
              enabled: false,

              custom: function (tooltip) {
                // tooltip will be false if tooltip is not visible or should be hidden
                if (!tooltip.body) {
                  console.log('not tooltip');

                  $('.chart-activity-week-tooltip__display').addClass('chart-activity-week-tooltip__display--hidden');
                  return;
                }
                console.log(tooltip);

                if (tooltip.body.length == 1 && tooltip.body[0] !== undefined) {
                  $('.chart-activity-week-tooltip__display').find('.value').html(Math.ceil(tooltip.dataPoints[0].yLabel));
                  $('.chart-activity-week-tooltip__display').find('.day').html(tooltip.dataPoints[0].xLabel);
                  $('.chart-activity-week-tooltip__display').removeClass('chart-activity-week-tooltip__display--hidden');

                }

              },
              callbacks: {
                beforeTitle: function () {
                  return '';
                },
                afterTitle: function () {
                  return '';
                },
                beforeBody: function () {
                  return '';
                },
                afterBody: function () {
                  return '';
                },
                beforeLabel: function () {
                  return '';
                },
                label: function (tooltipItem, data) {
                  return tooltipItem.yLabel;
                },
                afterLabel: function () {
                  return 'steps';
                },
                beforeFooter: function () {
                  return '';
                },
                footer: function () {
                  return '';
                },
                afterFooter: function () {
                  return '';
                },
              }
            },
            hover: {
              mode: 'label'
            },
          }
        }
      };
      /*
       _.each(scope.active, function(active, idx) {
       scope.chart.week.dataset[0].backgroundColor[idx] = calculateColor(active, scope.goal);
       });
       */

      scope.$watch('total', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          scope.total = newValue;
        }
      }, true);
      scope.$watch('active', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          scope.active = newValue;
          // update chart data manually
          scope.chart.week.data[0] = scope.active;
        }
      }, true);

    }
  };
});