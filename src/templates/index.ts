import { Template, utils } from 'fbi'
import * as ejs from 'ejs'
import Factory from '..'
import { formatName, capitalizeEveryWord } from 'fbi/lib/utils'
import SubTemplateReact from './react'
import SubTemplateVue from './vue'
import SubTemplateVue3 from './vue3'

export default class TemplateWeb extends Template {
  id = 'web'
  description = 'template for factory-web'
  path = 'templates/index'
  renderer = ejs.render
  templates = [new SubTemplateVue(this.factory), new SubTemplateReact(this.factory), new SubTemplateVue3(this.factory)]

  public projectInfo:Record<string | number, any> = {}

  constructor(public factory: Factory) {
    super()
  }

  protected async gathering(flags: Record<string, any>) {
    const {language} = await this.prompt(
      {
        type: 'select',
        name: 'language',
        message: `Which language do you want to use?`,
        hint: '(Use <arrow> to select, <return> to submit)',
        choices: [
          { name: 'vue', value: true },
          { name: 'react', value: true }
        ],
        result(name: string) {
          return name
        }
      } as any
    )
    this.projectInfo = await this.prompt([
      {
        type: 'Select',
        name: 'vueVersion',
        message: `Which version of vue do you want to choice?`,
        hint: '(Use <arrow> to select, <return> to submit)',
        skip({state}: any) {
          return language === 'react' ? true : false
        },
        choices: [
          { name: 'vue2', value: true },
          { name: 'vue3', value: true }
        ],
        result(names: string[]) {
          return this.map(names)
        }
      },
      {
        type: 'input',
        name: 'name',
        message: 'Input the project name',
        initial({ enquirer }: any) {
          return 'project-demo'
        },
        validate(value: any) {
          const name = formatName(value)
          return (name && true) || 'please input a valid project name'
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Input project description',
        initial({ state }: any) {
          return `${state.answers.name} description`
        }
      }
    ] as any)

    this.projectInfo.nameCapitalized = capitalizeEveryWord(this.projectInfo.name)
    const project = this.projectInfo
    try {
      this.configStore.set("projectInfo", project)
    } catch {
      // 若写入项目信息数据失败，终止后续流程
      return
    }

    const temps = utils.flatten(this.factory.templates.map((f: any) => f.templates))
    const choiseId = language === 'react' ? 'react' : project.vueVersion.vue2 ? 'vue' : 'vue3'
    const choiseTemp = temps.filter((it:any) => it.id === choiseId)[0]

    if (choiseTemp) {
      // set init data
      const factoryInfo = this.store.get(choiseTemp.factory.id)
      const info: Record<string, any> = await choiseTemp.run(
        {
          factory: {
            id: factoryInfo.id,
            path: factoryInfo.version?.latest?.dir || factoryInfo.path,
            version: factoryInfo.version?.latest?.short,
            template: choiseTemp.factory.id
          }
        },
        flags
      )

      if (!info) {
        return
      }

      // 清除暂存的项目数据
      this.configStore.del('projectInfo')
      // update store
      this.debug(`Save info into project store`)
      if (info.path) {
        this.projectStore.merge(info.path, {
          features: info.features,
          updatedAt: Date.now()
        })
      }
    }
  }


}
