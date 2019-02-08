const graphql = require("graphql");
const Goal = require("./models/goal");
const Dates = require("./models/date");
//const Log = require("./models/log");
const _ = require("lodash");
const mongoose = require("mongoose");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const LogType = new GraphQLObjectType({
  name: "Log",
  fields: () => ({
    id: { type: GraphQLID },
    logName: { type: GraphQLString },
    goalId: { type: GraphQLString }
  })
});

/* To query logs that work toward a goal
{
  goals {
    id
  	goalName
    logs{
      dateName
      logs{
        logName
      }
    }
  }
}
*/
const GoalType = new GraphQLObjectType({
  name: "Goal",
  fields: () => ({
    id: { type: GraphQLID },
    goalName: { type: GraphQLString },
    logs: {
      type: new GraphQLList(DateType),
      resolve(parent, args) {
        console.log("parent.id: " + parent.id);
        return Dates.find({ "logs.goalId": parent.id });
      }
    }
  })
});

const DateType = new GraphQLObjectType({
  name: "Date",
  fields: () => ({
    id: { type: GraphQLID },
    dateName: { type: GraphQLString },
    logs: {
      type: new GraphQLList(LogType)
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    date: {
      type: DateType,
      args: { dateName: { type: GraphQLString } },
      resolve(parent, args) {
        return Dates.findOne({ dateName: args.dateName });
      }
    },
    logs: {
      type: GraphQLList(DateType),
      resolve(parent, args) {
        return Dates.find({});
      }
    },
    /*
    dates: {
      type: new GraphQLList(DateType),
      resolve(parent, args) {
        return Dates.find({});
      }
    },
    */
    goals: {
      type: new GraphQLList(GoalType),
      resolve(parent, args) {
        return Goal.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    /*
    addGoal: {
      type: GoalType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    }*/

    addLog: {
      type: DateType,
      args: {
        logName: { type: new GraphQLNonNull(GraphQLString) },
        goalId: { type: new GraphQLNonNull(GraphQLID) },
        dateName: { type: new GraphQLNonNull(GraphQLString) }
        // date: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Dates.findOneAndUpdate(
          { dateName: args.dateName },
          { $push: { logs: { logName: args.logName, goalId: args.goalId } } },
          { returnNewDocument: true, upsert: true }
        );
      }
    },
    deleteLog: {
      type: DateType,
      args: {
        logId: { type: GraphQLID }
      },
      resolve(parent, args) {
        return Dates.findOneAndUpdate(
          {},
          { $pull: { logs: { _id: args.logId } } },
          //{ $pull: { logs: { logName: args.logName } } },
          { returnNewDocument: true, multi: true }
        );
      }
    },
    /*
    // add the logId to the corresponding date
    updateDate: {
      type: DateType,
      args: {
        dateName: { type: new GraphQLNonNull(GraphQLString) },
        logId: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        Dates.findOneAndUpdate(
          { dateName: args.dateName },
          { $push: { logId: args.logId } }
        ).then(function() {
          return;
        });
      }
    },*/

    addGoal: {
      type: GoalType,
      args: {
        goalName: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let goal = new Goal({
          goalName: args.goalName
        });
        return goal.save();
      }
    },

    addDate: {
      type: DateType,
      args: {
        dateName: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let date = new Dates({
          dateName: args.dateName
        });
        return date.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
