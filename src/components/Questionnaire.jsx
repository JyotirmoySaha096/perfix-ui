import React, { useEffect, useState } from "react";

const Questionnaire = ({ formData, setFormData, submitAnswer }) => {
  const [formDataArray, setFormDataArray] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    setFormDataArray(
      Object.entries(formData).map((entry) => {
        return [entry[0], { ...entry[1], value: "" }];
      })
    );
  }, [formData]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleNext = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrev = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmit = async () => {
    // Handle form submission here
    setSubmitting(true);
    let temp = {};
    for (let i = 0; i < formDataArray.length; i++) {
      temp[formDataArray[i]?.[0]] = formDataArray[i]?.[1];
    }
    setFormData(temp);
    await submitAnswer(temp);
    setSubmitting(false);
  };

  return (
    <div>
      <div>
        <h2>Question</h2>
        <div>
          <label>{formDataArray?.[currentQuestionIndex]?.[0]}</label>
          {formDataArray?.[currentQuestionIndex]?.[1]?.dataType ===
          "BooleanType" ? (
            <select
              required={
                formDataArray?.[currentQuestionIndex]?.[1]?.isRequired || false
              }
              disabled={submitting}
              value={formDataArray?.[currentQuestionIndex]?.[1]?.value || ""}
              onChange={(e) =>
                setFormDataArray(
                  formDataArray.map((item, index) =>
                    index === currentQuestionIndex
                      ? [
                          item[0],
                          {
                            ...item[1],
                            value: e.target.value,
                          },
                        ]
                      : item
                  )
                )
              }
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          ) : (
            <input
              required={
                formDataArray?.[currentQuestionIndex]?.[1]?.isRequired || false
              }
              value={formDataArray?.[currentQuestionIndex]?.[1]?.value || ""}
              onChange={(e) =>
                setFormDataArray(
                  formDataArray.map((item, index) =>
                    index === currentQuestionIndex
                      ? [
                          item[0],
                          {
                            ...item[1],
                            value: e.target.value,
                          },
                        ]
                      : item
                  )
                )
              }
            />
          )}
        </div>
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0 || submitting}
        >
          Prev
        </button>
        {currentQuestionIndex === formDataArray.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={
              formDataArray?.[currentQuestionIndex]?.[1]?.isRequired &&
              !formDataArray?.[currentQuestionIndex]?.[1]?.value
            }
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={
              formDataArray?.[currentQuestionIndex]?.[1]?.isRequired &&
              !formDataArray?.[currentQuestionIndex]?.[1]?.value
            }
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
