import React, { useState, useEffect } from "react";
import axios from "axios";
import Questionnaire from "./components/Questionnaire";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Card,
  CardContent,
  CircularProgress
} from "@mui/material";

const sampleStartQuestionnaireResponse = (params) => {
  if (params === "mysql") return { id: "426" };
  else if (params === "redis") return { id: "427" };
  else if (params === "dynamodb") return { id: "428" };
  else return {};
};

const sampleFetchQuestionsResponse = (params) => {
  if (params == "426")
    return {
      questions: {
        access_key: {
          dataType: "StringType",
          isRequired: true,
          // value: ""
        },
        secret_key: {
          dataType: "StringType",
          isRequired: true,
          // value: ""
        },
        launch_db: {
          dataType: "BooleanType",
          isRequired: true,
          //  value: ""
        },
        use_instance_role: {
          dataType: "BooleanType",
          isRequired: true,
          // value: "",
        },
      },
    };
  else if (params == "427")
    return {
      questions: {
        access_key: {
          dataType: "StringType",
          isRequired: true,
          // value: ""
        },
        secret_key: {
          dataType: "StringType",
          isRequired: true,
          // value: ""
        },
        launch_db: {
          dataType: "BooleanType",
          isRequired: true,
          //  value: ""
        },
        use_instance_role: {
          dataType: "BooleanType",
          isRequired: true,
          // value: "",
        },
      },
    };
  else if (params == "428")
    return {
      questions: {
        access_key: {
          dataType: "StringType",
          isRequired: true,
          // value: ""
        },
        secret_key: {
          dataType: "StringType",
          isRequired: true,
          // value: ""
        },
        launch_db: {
          dataType: "BooleanType",
          isRequired: true,
          //  value: ""
        },
        use_instance_role: {
          dataType: "BooleanType",
          isRequired: true,
          // value: "",
        },
      },
    };
  else return {};
};

const sampleStartExperimentResponse = (params) => {
  return {
    overallQueryTime: 1200,
    overallWriteTimeTaken: 800,
    numberOfCalls: 50,
    queryLatencies: [
      { percentile: 50, latency: 150 },
      { percentile: 95, latency: 300 },
    ],
    writeLatencies: [
      { percentile: 50, latency: 100 },
      { percentile: 95, latency: 250 },
    ],
  };
};

function App() {
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("redis");
  const [questionnaireId, setQuestionnaireId] = useState(null);
  const [formData, setFormData] = useState({});
  const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
  const [experimentStarted, setExperimentStarted] = useState(false);
  const [experimentResults, setExperimentResults] = useState(null);

  const startQuestionnaire = async () => {
    setLoading(true);
    try {
      const response = await axios
        .create({ baseURL: "http://localhost:9000" })
        .post("/questionnaire?storeName=" + selectedOption);
      const newQuestionnaireId = response.data.id;

      setQuestionnaireId(newQuestionnaireId);
    } catch (error) {
      console.error("Error:", error);
      // Handle error
      const newQuestionnaireId =
        sampleStartQuestionnaireResponse(selectedOption).id;

      setQuestionnaireId(newQuestionnaireId);
    }
    setLoading(false);
  };

  useEffect(() => {
    // This code will run when questionnaireId changes.
    if (questionnaireId !== null) {
      // Perform actions that depend on the updated questionnaireId here.
      // You can call the fetchQuestionFields function here if needed.

      fetchQuestionFields();
    }
  }, [questionnaireId]); // This specifies that useEffect should run when questionnaireId changes.

  const fetchQuestionFields = () => {
    axios
      .create({ baseURL: "http://localhost:9000" })
      .get(`/questionnaire/${questionnaireId}/question`)
      .then((response) => {
        if (response.data === null) {
          setQuestionnaireComplete(true);
        } else {
          const fields = response.data.questions;
          setFormData(fields);
        }
      })
      .catch((error) => {
        // Handle error

        const fields = sampleFetchQuestionsResponse(questionnaireId).questions;
        setFormData(fields);
      });
  };

  const submitAnswer = async (formData) => {
    const toBeSendDoc = {
      answers: Object.entries(formData)?.map(([field, fieldType]) => ({
        questionLable: field,
        answer: fieldType?.value || "",
      })),
    };
    await axios
      .create({ baseURL: "http://localhost:9000" })
      .post(
        `/questionnaire/${questionnaireId}/question`,
        JSON.stringify(toBeSendDoc)
      )
      .then(() => {
        setQuestionnaireComplete(true);
      })
      .catch((error) => {
        // Handle error

        setQuestionnaireComplete(true);
      });
  };

  const startExperiment = async () => {
    setLoading(true);
    await axios
      .create({ baseURL: "http://localhost:9000" })
      .post(`/questionnaire/${questionnaireId}`)
      .then((response) => {
        setExperimentResults(response.data);
        setExperimentStarted(true);
      })
      .catch((error) => {
        // Handle error
        const response = sampleStartExperimentResponse(questionnaireId);
        setExperimentResults(response);
        setExperimentStarted(true);
      });
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#edebeb80",
      }}
    >
      <Card sx={{ width: "50%", height: "95%", borderRadius: 8 }}>
        <CardContent
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            pt: 10,
            gap: 5,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={"bold"}>
              Questionnaires:
            </Typography>
            <hr style={{ visibility: "hidden" }} />
            <Typography variant="body1" fontWeight={"normal"} maxWidth={"60%"}>
              Please Select a topic for start questionnaries
            </Typography>
          </Box>

          {!questionnaireId && (
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
              width={"80%"}
              height={"50%"}
              gap={4}
              pl={4}
            >
              <Typography variant="h5">Select an option:</Typography>
              <FormControl sx={{ minWidth: "50%" }} disabled={loading}>
                <Select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  <MenuItem value="redis">Redis</MenuItem>
                  <MenuItem value="mysql">MySQL</MenuItem>
                  <MenuItem value="dynamodb">DynamoDB</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="secondary"
                onClick={startQuestionnaire}
                sx={{ borderRadius: 3 }}
                disabled={loading}
              >
                {loading && <CircularProgress size={24} sx={{color:"white", mr:2}} />} Start Questionnaire
              </Button>
            </Box>
          )}

          {questionnaireId && !questionnaireComplete && (
            <Questionnaire
              formData={formData}
              setFormData={setFormData}
              submitAnswer={submitAnswer}
            />
          )}

          {questionnaireComplete && !experimentStarted && (
            <Box>
              <Button
                variant="contained"
                onClick={startExperiment}
                sx={{ borderRadius: 3, }}
                color="secondary"
                disabled={loading}
              >
                {loading && <CircularProgress size={24} sx={{color:"white", mr:2}} />}  Start Experiment
              </Button>
            </Box>
          )}
          {experimentStarted && experimentResults && (
            <Box>
              <Typography variant="body1">
                Overall Query Time: {experimentResults.overallQueryTime}
              </Typography>
              <Typography variant="body1">
                Overall Write Time Taken:{" "}
                {experimentResults.overallWriteTimeTaken}
              </Typography>
              <Typography variant="body1">
                Number Of Calls: {experimentResults.numberOfCalls}
              </Typography>

              <Typography variant="h6">Query Latencies:</Typography>
              {experimentResults.queryLatencies.map((item, index) => (
                <Typography variant="body1" key={index}>
                  Percentile: {item.percentile}, Latency: {item.latency}
                </Typography>
              ))}

              <Typography variant="h6">Write Latencies:</Typography>
              {experimentResults.writeLatencies.map((item, index) => (
                <Typography variant="body1" key={index}>
                  Percentile: {item.percentile}, Latency: {item.latency}
                </Typography>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default App;
