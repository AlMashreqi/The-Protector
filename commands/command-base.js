const config = require("@data/config.json");
const prefix = config.Config.prefix


const validatePermissions = (permissions) => {
  const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
  ]

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown Permission Node "${permission}"`)
    }
  }
}

const allCommands = {};
let commands = [];

module.exports = (commandOptions) => {
  let {
    commands,
    permissions = [],
  } = commandOptions

  // Ensure the command and aliases are in an array
  if (typeof commands === 'string') {
    commands = [commands]
  }

  console.log(`[+] "${commands[0]}" Command Loaded.`)

  // Ensure the permissions are in an array and are all valid
  if (permissions.length) {
    if (typeof permissions === 'string') {
      permissions = [permissions]
    }

    validatePermissions(permissions)
  }

  for (const command of commands) {
    allCommands[command] = {
      ...commandOptions,
      commands,
      permissions
    };
  }
}

let recentlyRan = [] // guildId-userId-command

module.exports.listen = (client) => {
  // Listen for messages
  client.on('message', (message) => {
    const { member, content, guild, channel} = message

    // Split on any number of spaces
    const arguments = content.split(/[ ]+/)

    // Remove the command which is the first index
    const name = arguments.shift().toLowerCase();

    if (name.startsWith(prefix)) {
      const command = allCommands[name.replace(prefix, "")];
      if (!command) {
        console.log(`[-] ${name} not found`)
        return;
      }


      const {
        permissions,
        permissionError = "You don't have permission to run this command",
        requiredRoles = [],
        allowedRoles = [],
        minArgs = 0,
        maxArgs = null,
        cooldown = -1,
        requiredChannel = '',
        expectedArgs,
        callback
      } = command; 

      // Ensure we are in the right channel
      if (requiredChannel.length > 0) {
        if (requiredChannel !== channel.name) {
          //<#ID>
          const foundChannel = guild.channels.cache.find((channel) => {
            return channel.name === requiredChannel
          })
          return
        }        
      }

      // Ensure the user has the required permissions
      for (const permission of permissions) {
        if (!member.hasPermission(permission)) {
          message.reply(permissionError)
          return
        }
      }

      // Ensure the user has the required roles
      for (const requiredRole of requiredRoles) {
        const role = guild.roles.cache.find(
          (role) => role.name === requiredRole
        )
        if (!role || !member.roles.cache.has(role.id)) {
          message.reply(
            `You don't have permissions to use this command.`
          )
          return
        }
      }
      
      // var hasRoles = [];
      // Ensure the user has the allowed roles
      // for (const allowedRole of allowedRoles) {
      //   const role = guild.roles.cache.find(
      //     (role) => role.name === allowedRole
      //   )
      //   if (member.roles.cache.has(role.id)) {
      //     hasRoles.push(role.id);
      //   }
      // }
      if (allowedRoles.length > 0) {
        const hasRole = member.roles.cache.find((role) => {
          return allowedRoles.includes(role.name)
        })
        if (!hasRole) {
          message.reply(
            `You don't have permissions to use this command.`
          )
          return
        }
      }

      // Ensure the user has not ran this command too frequently
      let cooldownString = `${guild.id}-${member.id}-${command.commands[0]}`

      if (cooldown > 0 && recentlyRan.includes(cooldownString)) {
        message.reply('You cannot use that command so soon, Please wait.')
        return
      }



      // Ensure we have the correct number of arguments
      if (
        arguments.length < minArgs ||
        (maxArgs !== null && arguments.length > maxArgs)
      ) {
        message.reply(
          `Incorrect syntax! Use ${prefix}${name} ${expectedArgs}`
        )
        return
      }

      if (cooldown > 0) {
        recentlyRan.push(cooldownString)

        setTimeout(() => {
          recentlyRan = recentlyRan.filter((string) => {
            return string !== cooldownString
          })

        }, 1000 * cooldown)
      }

      // Handle the custom command code
      callback(message, arguments, arguments.join(' '), client)
    }
  })
}