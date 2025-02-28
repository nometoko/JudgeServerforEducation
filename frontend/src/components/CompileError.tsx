import { Box, Code } from "@chakra-ui/react"

const CompileError: React.FC<{ compileError: string }> = ({ compileError }) => {
  return (
    <Box>
      <h2>Compile Error</h2>
      <Code
        p={2}
        bg="gray.100"
        rounded="md"
        display="block"
        whiteSpace="pre-wrap"
        textAlign={"left"}
      >
        {compileError}
      </Code>
    </Box>
  )
}

export default CompileError
