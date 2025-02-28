
import { Button, Divider, Heading, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import StatusBlock from './StatusBlock'
import { CheckAccessPermission } from '../providers/AuthGuard'

interface problemStatus {
  ProblemId: number,
  ProblemName: string,
  Status: string,
}

export interface B3StatusProps {
  UserName: string,
  ProblemsStatus: problemStatus[],
}

export const B3results = ({ data }: { data: B3StatusProps[] }) => {
  const navigate = useNavigate()
  const authUserName = localStorage.getItem("authUserName");
  const authJoinedDate = localStorage.getItem("authJoinedDate");
  console.log("authUserName", authUserName);
  console.log("authJoinedDate", authJoinedDate);
  let [permission, _] = [false, ""]
  if (authUserName && authJoinedDate) {
    [permission, _] = CheckAccessPermission({
      authUserName: authUserName,
      authJoinedDate: new Date(authJoinedDate)
    });
  }

  return (
    <>
      <Heading mt={5} textAlign="left">B3 Status</Heading>
      <br />

      <Divider />
      <TableContainer>
        <Table variant='simple'>
          <TableCaption></TableCaption>
          <Thead>
            <Tr>
              <Th>Problem</Th>
              {data?.map(b3 => (
                <Th key={b3.UserName}>
                  {permission ?
                    <Button variant="link" onClick={() => navigate(`/results?user=${b3.UserName}`)}>
                      {b3.UserName}
                    </Button>
                    :
                    b3.UserName
                  }
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.length > 1 && data[0].ProblemsStatus?.map((problem, i) => (
              <Tr key={problem.ProblemId}>
                <Td>{problem.ProblemName}</Td>
                {data?.map(b3 => (
                  permission ?
                    <Td key={b3.UserName}><StatusBlock status={b3.ProblemsStatus[i].Status} onClick={() => navigate(`/results?user=${b3.UserName}&problem=${problem.ProblemId}`)} /></Td>
                    :
                    <Td key={b3.UserName}><StatusBlock status={b3.ProblemsStatus[i].Status} /></Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  )
}
