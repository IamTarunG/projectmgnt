const Client = require("../model/Client.js");

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLEnumType,
} = require("graphql");
const Project = require("../model/Project.js");
const ClientType = new GraphQLObjectType({
    name: "Client",
    description: "The fields of Client",
    fields: () => ({
        id: {
            type: GraphQLID,
        },
        name: {
            type: GraphQLString,
        },
        email: {
            type: GraphQLString,
        },
        phone: {
            type: GraphQLString,
        },
    }),
});
const ProjectType = new GraphQLObjectType({
    name: "Project",
    description: "The fileds of Project",
    fields: () => ({
        id: {
            type: GraphQLString,
        },
        name: {
            type: GraphQLString,
        },
        status: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        },
        client: {
            type: ClientType,
            resolve: (parent, args) => {
                return Client.findById(parent.clientId);
            },
        },
    }),
});
const RootQuery = new GraphQLObjectType({
    name: "RootQuery",
    description: "The Root Query contains all the fields",
    fields: () => ({
        clients: {
            type: new GraphQLList(ClientType),
            resolve: () => {
                return Client.find();
            },
        },
        projects: {
            type: new GraphQLList(ProjectType),
            resolve: () => {
                return Project.find();
            },
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id);
            },
        },
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Project.findById(args.id);
            },
        },
    }),
});
const RootMutation = new GraphQLObjectType({
    name: "Mutation",
    description: "All mutations",
    fields: () => ({
        addClient: {
            type: ClientType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                email: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                phone: {
                    type: new GraphQLNonNull(GraphQLString),
                },
            },
            resolve: (parent, args) => {
                const newClient = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return newClient.save();
            },
        },
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                Project.find({ clientId: args.id }).then((projects) => {
                    projects.forEach((project) => {
                        project.remove();
                    });
                });

                return Client.findByIdAndRemove(args.id);
            },
        },
        addProject: {
            type: ProjectType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                description: {
                    type: new GraphQLNonNull(GraphQLString),
                },
                status: {
                    type: new GraphQLEnumType({
                        name: "Status",
                        values: {
                            new: {
                                value: "Not Started",
                            },
                            progress: {
                                value: "In Progress",
                            },
                            completed: {
                                value: "Completed",
                            },
                        },
                    }),
                    defaultValue: "Not Started",
                },
                clientId: {
                    type: new GraphQLNonNull(GraphQLID),
                },
            },
            resolve: (parent, args) => {
                const newProject = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });
                return newProject.save();
            },
        },
        deleteProject: {
            type: new GraphQLNonNull(ProjectType),
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                },
            },
            resolve: (parent, args) => {
                return Project.findByIdAndRemove(args.id);
            },
        },
        updateProject: {
            type: ProjectType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                },
                name: {
                    type: GraphQLString,
                },
                description: {
                    type: GraphQLString,
                },
                status: {
                    type: new GraphQLEnumType({
                        name: "StatusUpdate",
                        values: {
                            new: {
                                value: "Not Started",
                            },
                            progress: {
                                value: "In Progress",
                            },
                            completed: {
                                value: "Completed",
                            },
                        },
                    }),
                },
            },
            resolve: (parent, args) => {
                return Project.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status,
                        },
                    },
                    { new: true }
                );
            },
        },
    }),
});
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});
