import React, { useState, useEffect, createContext, useCallback } from "react";
import { styled } from "@mui/material/styles";
import { Snackbar, Alert } from "@mui/material";
import { atom, useAtom } from "jotai";

enum FeedbackStatus {
  ERROR = 0,
  WARNING,
  INFO,
  SUCCESS,
}

const StatusSevrityTable = {
  0: "error",
  1: "warning",
  2: "info",
  3: "success",
};

type Feedback = {
  text: string;
  status: FeedbackStatus;
};

type FeedbackContextValues = {
  feedback?: Feedback;
  isOpen: boolean;
  setOpen: React.Dispatch<boolean>;
  setFeedback: React.Dispatch<Feedback>;
  setSuccess: React.Dispatch<string>;
  setError: React.Dispatch<string>;
};

//@ts-ignore
const defaultContext: FeedbackContextValues = {};

export const FeedbackContext = createContext(defaultContext);

//@ts-ignore
const FeedbackNotif = styled(({ feedback, open, setOpen, ...props }) => {
  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  }, []);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      {...props}
    >
      {/* @ts-ignore */}
      <Alert severity={StatusSevrityTable[feedback?.status]} variant="filled">
        {feedback?.text}
      </Alert>
    </Snackbar>
  );
})``;

export default function FeedbackProvider(props: any) {
  const [feedback, setFeedbackRaw] = useState<Feedback>();
  const [isOpen, setOpen] = useState(false);

  const setFeedback = useCallback((feedback: Feedback) => {
    setFeedbackRaw(feedback);
    setOpen(true);
  }, []);

  const setSuccess = useCallback((text: string) => {
    setFeedback({ text, status: FeedbackStatus.SUCCESS });
  }, []);

  const setError = useCallback((text: string) => {
    setFeedback({ text, status: FeedbackStatus.ERROR });
  }, []);

  const context: FeedbackContextValues = {
    feedback,
    setFeedback,
    setSuccess,
    setError,
    isOpen,
    setOpen,
  };

  return (
    <FeedbackContext.Provider value={context}>
      {props.children}
      {/* @ts-ignore */}
      <FeedbackNotif feedback={feedback} open={isOpen} setOpen={setOpen} />
    </FeedbackContext.Provider>
  );
}
