# mongodb-collection-stats
This is a simple utility to get statistics for all collections in a database.

## Getting Started
1. Clone this repository
2. Create a `.env` file in the root directory of the cloned repository.
3. Provide the following environment variable values in the `.env` file:
   * `DB_URI` - The connection string for your MongoDB database, with credentials.
   * `SOURCE_DB` - The name of the database that has the collections you want to gather stats for.
   * `RESULTS_DB` - The name of the database that you want to write the stat results to.
   * `RESULTS_COLL` - The name of the collection that you want to write the stat results to. 
