import React, { useState, useEffect } from "react";
import axios from "axios";
import Questionnaire from "./components/Questionnaire";

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
  const [selectedOption, setSelectedOption] = useState("redis");
  const [questionnaireId, setQuestionnaireId] = useState(null);
  const [formData, setFormData] = useState({});
  const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
  const [experimentStarted, setExperimentStarted] = useState(false);
  const [experimentResults, setExperimentResults] = useState(null);

  const startQuestionnaire = async () => {
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

  const startExperiment = () => {
    axios
      .create({ baseURL: "http://localhost:9000" })
      .post(`/questionnaire/${questionnaireId}`)
      .then(() => {
        setExperimentStarted(true);
      })
      .catch((error) => {
        // Handle error
        const response = sampleStartExperimentResponse(questionnaireId);
        setExperimentResults(response);
        setExperimentStarted(true);
      });
  };

  return (
    <div className="App">
      <h1>Questionnaire and Experiment</h1>
      {!questionnaireId && (
        <div>
          <h2>Select an option:</h2>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="redis">Redis</option>
            <option value="mysql">MySQL</option>
            <option value="dynamodb">DynamoDB</option>
          </select>
          <button onClick={startQuestionnaire}>Start Questionnaire</button>
        </div>
      )}

      {questionnaireId && !questionnaireComplete && (
        <Questionnaire
          formData={formData}
          setFormData={setFormData}
          submitAnswer={submitAnswer}
        />
      )}

      {questionnaireComplete && !experimentStarted && (
        <div>
          <button onClick={startExperiment}>Start Experiment</button>
        </div>
      )}
      {experimentStarted && experimentResults && (
        <div>
          <p>Overall Query Time: {experimentResults.overallQueryTime}</p>
          <p>
            Overall Write Time Taken: {experimentResults.overallWriteTimeTaken}
          </p>
          <p>Number Of Calls: {experimentResults.numberOfCalls}</p>

          <h3>Query Latencies:</h3>
          {experimentResults.queryLatencies.map((item, index) => (
            <p key={index}>
              Percentile: {item.percentile}, Latency: {item.latency}
            </p>
          ))}

          <h3>Write Latencies:</h3>
          {experimentResults.writeLatencies.map((item, index) => (
            <p key={index}>
              Percentile: {item.percentile}, Latency: {item.latency}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
