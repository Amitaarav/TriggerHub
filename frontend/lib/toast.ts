import { toast } from "sonner";

export const extractErrorMessage = (error: unknown, fallbackMessage = "An unexpected error occurred."): string => {
  if (!error) return fallbackMessage;

  if (typeof error === "string") return error;

  const err = error as {
    response?: {
      data?: {
        error?: string;
        message?: string;
      } | string;
      status?: number;
    };
    message?: string;
  };

  if (err.response?.data) {
    if (typeof err.response.data === "string") {
      return err.response.data;
    }
    if (err.response.data.error) {
      return err.response.data.error;
    }
    if (err.response.data.message) {
      return err.response.data.message;
    }
  }

  if (err.response?.status === 401) {
    return "Your session has expired. Please log in again.";
  }
  if (err.response?.status === 403) {
    return "You do not have permission to perform this action.";
  }
  if (err.response?.status === 404) {
    return "The requested resource could not be found.";
  }
  if (err.response?.status === 500) {
    return "Internal server error. Please try again shortly.";
  }

  if (err.message && !err.message.includes("status code")) {
    return err.message;
  }

  return fallbackMessage;
};

export const showSuccess = (title: string, description?: string) => {
  toast.success(title, {
    description,
    duration: 4000,
  });
};

export const showError = (title: string, errorOrDescription?: unknown) => {
  const desc =
    typeof errorOrDescription === "string"
      ? errorOrDescription
      : errorOrDescription
      ? extractErrorMessage(errorOrDescription)
      : undefined;

  toast.error(title, {
    description: desc,
    duration: 5000,
  });
};

export const showInfo = (title: string, description?: string) => {
  toast.info(title, {
    description,
    duration: 3500,
  });
};

export const showWarning = (title: string, description?: string) => {
  toast.warning(title, {
    description,
    duration: 4500,
  });
};

export const showCopied = (itemLabel = "Copied to clipboard") => {
  toast.success(itemLabel, {
    duration: 2000,
  });
};
