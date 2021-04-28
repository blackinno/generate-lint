// #!/usr/bin/env node
const { exec } = require('child_process')
const { writeFile, readdir, readFile } = require('fs').promises
const chalk = require('chalk')
const inquirer = require('inquirer')
const path = require('path')

const { install } = require('./install-command')

const configLanguageTypes = {}
const fileDetails = {}
const configFolderPath = path.resolve(__dirname, 'configs')

async function bootstrap() {
  const configTypes = await readdir(configFolderPath).catch(console.log)

  for (let type of configTypes) {
    const configTypePath = path.resolve(__dirname, 'configs', type)
    configLanguageTypes[type] = configTypePath
  }
  const { language } = await inquirer.prompt([
    {
      type: 'list',
      message: "Pick the NodeJS language framework you're using:",
      name: 'language',
      default: 'javascript',
      choices: Object.keys(configLanguageTypes)
    }
  ])
  const installCommand = install[language]
  const files = await readdir(path.join(configFolderPath, language)).catch(console.log)

  for (let file of files) {
    const name = file.split('.')[0]
    fileDetails[name] = JSON.parse(
      await readFile(path.join(configFolderPath, language, file), 'utf-8').catch(console.log)
    )
  }

  for (let key of Object.keys(fileDetails)) {
    const object = JSON.stringify(fileDetails[key], null, 2)
    await writeFile(path.join(process.cwd(), `.${key}`), object)
  }

  console.log(`${chalk.blue.bold('[INFO]')}: Install used packages...`)

  const installing = exec(installCommand)

  installing.on('close', () => {
    const text = `${chalk.green.bold('[SUCCESS]')}: Install package success`
    console.log(text)
  })
}

bootstrap()
