import { gql } from '@apollo/client'
const ADD_PROJECT = gql`
    mutation AddProject(
        $name : String!
        $description : String!
        $status : Status!
        $clientId : ID!
    ){
        addProject(
            name : $name
            description: $description
            status: $status
            clientId: $clientId
        ){
             id
            name
            description
            status
            client {
                id
                name
                email
                phone
            }
        }
    }
`

const DELETE_PROJECT = gql`
    mutation DeleteProject($id:ID!){
        deleteProject(id:$id){
            id
        }
    }
`
const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $name: String!
    $description: String!
    $status: StatusUpdate!
  ) {
    updateProject(
      id: $id
      name: $name
      description: $description
      status: $status
    ) {
      id
      name
      description
      status
      client {
        id
        name
        email
        phone
      }
    }
  }
`;
export { ADD_PROJECT, DELETE_PROJECT, UPDATE_PROJECT }