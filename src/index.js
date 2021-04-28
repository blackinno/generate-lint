// #!/usr/bin/env node
const inquirer = require('inquirer')
const path = require('path')
const { writeFile, readdir, readFile } = require('fs').promises

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
      choices: Object.keys(configLanguageTypes)
    }
  ])

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
}

bootstrap()
