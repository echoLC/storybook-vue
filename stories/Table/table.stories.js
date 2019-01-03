import { storiesOf } from '@storybook/vue'

import TableRender from './Table.vue'

function renderInput(h, row, key, editKey) {
  return h('input', {
    domProps: {
      value: row[key]
    },
    on: {
      input: e => {
        this[editKey] = e.target.value
      }
    }
  })
}

function isEditCurrent(index) {
  return this.editIndex === index
}

function formateDate(time) {
  const date = new Date(parseInt(time))
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${month}-${day}`
}

function renderSaveBtn(h, index) {
  return [
    h(
      'button',
      {
        on: {
          click: () => {
            this.data[index].name = this.editName
            this.data[index].age = this.editAge
            this.data[index].birthday = this.editBirthday
            this.data[index].address = this.editAddress
            this.editIndex = -1
          }
        }
      },
      '保存'
    ),
    h(
      'button',
      {
        style: {
          marginLeft: '6px'
        },
        on: {
          click: () => {
            this.editIndex = -1
          }
        }
      },
      '取消'
    )
  ]
}

function renderEditBtn(h, index, row) {
  return h(
    'button',
    {
      on: {
        click: () => {
          this.editName = row.name
          this.editAge = row.age
          this.editAddress = row.address
          this.editBirthday = row.birthday
          this.editIndex = index
        }
      }
    },
    '修改'
  )
}

function render(key, editKey, option = {}) {
  return (h, { row, index }) => {
    const edit = isEditCurrent.call(this, index)
      ? [renderInput.call(this, h, row, key, editKey)]
      : typeof option.format === 'function'
      ? option.format(row[key])
      : row[key]
    return h('div', [edit])
  }
}

storiesOf('Table', module).add('default-table', () => ({
  components: { TableRender },
  template: '<div><table-render :columns="columns" :data="data"/></div>',
  data() {
    return {
      columns: [
        {
          title: '姓名',
          key: 'name',
          render: render.call(this, 'name', 'editName')
        },
        {
          title: '年龄',
          key: 'age',
          render: render.call(this, 'age', 'editAge')
        },
        {
          title: '出生日期',
          key: 'birthday',
          render: render.call(this, 'birthday', 'editBirthday', {
            format: formateDate
          })
        },
        {
          title: '地址',
          key: 'address',
          render: render.call(this, 'address', 'editAddress')
        },
        {
          title: '操作',
          render: (h, { row, index }) => {
            return isEditCurrent.call(this, index)
              ? renderSaveBtn.call(this, h, index)
              : renderEditBtn.call(this, h, index, row)
          }
        }
      ],
      data: [
        {
          name: '王小明',
          age: 18,
          birthday: Date.now(),
          address: '北京市朝阳区芍药居'
        },
        {
          name: '张小刚',
          age: 25,
          birthday: '696096000000',
          address: '北京市海淀区西二旗'
        },
        {
          name: '李小红',
          age: 30,
          birthday: Date.now(),
          address: '上海市浦东新区世纪大道'
        },
        {
          name: '周小伟',
          age: 26,
          birthday: Date.now(),
          address: '深圳市南山区深南大道'
        }
      ],
      editName: '',
      editAge: '',
      editBirthday: '',
      editAddress: '',
      editIndex: -1
    }
  }
}))
