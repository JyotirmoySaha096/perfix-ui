import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  CircularProgress
} from "@mui/material";

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
    <Box width={"100%"}>
      <Typography variant="h6" fontWeight={"normal"}>
        Answer the followings:
      </Typography>
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        gap={1}
        m={1}
        mb={4}
      >
        <InputLabel>{formDataArray?.[currentQuestionIndex]?.[0]}:</InputLabel>
        {formDataArray?.[currentQuestionIndex]?.[1]?.dataType ===
        "BooleanType" ? (
          <FormControl disabled={submitting} sx={{ width: "25%" }}>
            <Select
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
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <TextField
            value={formDataArray?.[currentQuestionIndex]?.[1]?.value || ""}
            sx={{ width: "25%" }}
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
      </Box>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={1}
      >
        <Button
          variant="contained"
          onClick={handlePrev}
          color="error"
          disabled={currentQuestionIndex === 0 || submitting}
        >
          Prev
        </Button>
        <Button
          variant="contained"
          onClick={
            currentQuestionIndex === formDataArray.length - 1
              ? handleSubmit
              : handleNext
          }
          color={
            currentQuestionIndex === formDataArray.length - 1
              ? "success"
              : "secondary"
          }
          disabled={
            formDataArray?.[currentQuestionIndex]?.[1]?.isRequired &&
            !formDataArray?.[currentQuestionIndex]?.[1]?.value
          }
        >
          {currentQuestionIndex === formDataArray.length - 1
            ? "Submit"
            : "Next"}
        </Button>
      </Box>
      {submitting && <CircularProgress sx={{m:2}}/>}
    </Box>
  );
};

export default Questionnaire;
