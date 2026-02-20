export function validateField(name: string, value: string): string {
  let errorMessage = "";

  const isNanValue = isNaN(Number(value));

  if (name.startsWith("no")) {
    if (isNanValue || Number(value) < 0) {
      errorMessage = "This has to be a non-negative number.";
    }
  } else {
    if (value.trim() === "") {
      errorMessage = "This field is required.";
    }
  }

  if (name === "siteUrl" && value.trim() !== "") {
    try {
      new URL(value);
    } catch {
      errorMessage = "Please enter a valid URL.";
    }
  }
  return errorMessage;
}
