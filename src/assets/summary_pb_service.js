var ProtoFiles_example_pb = require("./summary_pb");

var example = example || {};

example.TextSummary = (function () {
  function TextSummary() {}
  TextSummary.serviceName = "TextSummary";
  return TextSummary;
})();

example.TextSummary.summary = {
  methodName: "summary",
  service: example.TextSummary,
  requestStream: false,
  responseStream: false,
  requestType: ProtoFiles_example_pb.Request,
  responseType: ProtoFiles_example_pb.Result
};

exports.example = example;
