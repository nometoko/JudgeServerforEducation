export const getStatusColor = ({ status }: { status: string }) => {
  switch (status) {
    case "success":
    case "Accepted":
      return "green.500";
    case "error":
    case "Pending":
      return "red.500";
    case "warning":
      return "yellow.500";
    default:
      return "gray.500";
  }
};
