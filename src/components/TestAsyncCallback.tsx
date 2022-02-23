import React, { useState } from "react";

import { styled } from "@mui/material/styles";
import { Paper, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import formatRes from "@utils/formatRes";

const TestAsyncCallback = styled(
  ({
    label,
    callback,
    ...props
  }: {
    label: string;
    callback: () => Promise<any>;
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [res, setRes] = useState<[any, any]>();

    async function handleClick() {
      setIsLoading(true);
      const res = await formatRes(callback());
      setRes(res);
      setIsLoading(false);
    }

    return (
      <Paper {...props}>
        <Stack spacing={2}>
          <Typography className="label">{label}</Typography>
          <LoadingButton
            onClick={handleClick}
            loading={isLoading}
            variant="contained"
          >
            Call
          </LoadingButton>
          {res && (
            <>
              {res[0] && (
                <Paper className="result response">
                  <Typography className="label">Response</Typography>
                  <Typography>{JSON.stringify(res[0]?.data)}</Typography>
                </Paper>
              )}

              {res[1] && (
                <Paper className="result error">
                  <Typography className="label">Error</Typography>
                  <Typography>{JSON.stringify(res[1])}</Typography>
                </Paper>
              )}
            </>
          )}
        </Stack>
      </Paper>
    );
  }
)`
  background: ${({ theme }) => theme.palette.secondary.dark};
  padding: 2em;
  text-align: center;

  .MuiLoadingButton-root {
  }

  .result {
    background: ${({ theme }) => theme.palette.secondary.main};
    padding: 0.5em 2em;
  }

  .result {
    .label {
      margin-bottom: 0.5em;
    }
  }

  .response {
    .label {
      color: ${({ theme }) => theme.palette.success.main};
    }
  }

  .error {
    .label {
      color: ${({ theme }) => theme.palette.error.main};
    }
  }
`;

export default TestAsyncCallback;
