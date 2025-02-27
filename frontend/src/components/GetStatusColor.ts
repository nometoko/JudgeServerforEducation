export const getStatusColor = ({ status }: { status: string }) => {
  switch (status) {
    case "success":
      return "green.500";
    case "error":
      return "red.500";
    case "warning":
      return "yellow.500";
    default:
      return "gray.500";
  }
};