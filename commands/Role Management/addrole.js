const { Command } = require('discord.js-commando')
const discord = require('discord.js')

class addRoleCommand extends Command{

    constructor(client){

        super(client,{
            name: 'addrole',
            memberName: 'addrole',
            group: 'role',
            description: 'Assigns a user a role.',
            details: 'Adds the @mentioned-role to the @mentioned-user.',
            examples: ['..addrole @HS @dev'],
            clientPermissions: ['MANAGE_ROLES'],
            userPermissions: ['MANAGE_ROLES'],
            args: [{
                key: 'user',
                type: 'member',
                prompt: 'Who would you like to add the role to?'
            },{
                key: 'role',
                type: 'role',
                prompt: 'Which role would you like to add?'
            }]
        })

    }

    async run(msg, {user, role}){
        try{

            await user.addRole(role)
            return await msg.say(`${user} has been given the role ${role}.`)
            
        }
        catch(err){

            return await msg.say(`${user} could not be given the role.${role}`)

        }
    }

}

module.exports = addRoleCommand