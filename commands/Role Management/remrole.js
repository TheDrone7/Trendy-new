const { Command } = require('discord.js-commando')
const discord = require('discord.js')

class remRoleCommand extends Command{

    constructor(client){

        super(client,{
            name: 'remrole',
            memberName: 'remrole',
            group: 'role',
            description: 'Removes a role from a user.',
            details: 'Removes the @mentioned-role from the @mentioned-user.',
            examples: ['=remrole @HS @dev'],
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            args: [{
                key: 'user',
                type: 'member',
                prompt: 'Who would you like to remove the role from?'
            },{
                key: 'role',
                type: 'role',
                prompt: 'Which role would you like to remove?'
            }]
        })

    }

    async run(msg, {user, role}){
        try{

            await user.removeRole(role)
            return await msg.say(`${user} has been deprived of the role ${role}.`)

        }
        catch(err){

            return await msg.say(`${role} could not be removed from the user ${user}`)

        }
    }

}

module.exports = remRoleCommand
