const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name);

        if (existingCommand) {
            if (localCommand.deleted) {
                await applicationCommands.delete(existingCommand.id);
                console.log(`🗑️: Comando eliminado "${name}".`);
                continue;
            }

        if (areCommandsDifferent(existingCommand, localCommand)) { 
            await applicationCommands.edit(existingCommand.id, {description, options });
            console.log(`📝: Comando editado "${name}".`);
        }
    } else {
        if (localCommand.deleted) {
          console.log(
            `❌: No se puede eliminar el comando "${name}" porque no existe.`
          );
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(`📥 Comando registrado "${name}".`);
      }
    }
  } catch (error) {
    console.log(`Sucedio un error al registrar los comandos: ${error}`);
  }
};