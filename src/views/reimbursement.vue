<template>
  <div v-if="isAuth(['ROOT', 'DATA:SELECT'])">

    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item prop="name">
        <el-input
            v-model="dataForm.name"
            placeholder="关键字"
            size="medium"
            class="input"
            clearable="clearable"
        />
      </el-form-item>

      <el-form-item>
        <el-button size="medium" type="primary" @click="searchHandle()">查询</el-button>
        <el-button
            size="medium"
            type="danger"
            :disabled="!isAuth(['ROOT', 'DATA:IMPORT'])"
            @click="importHandle()"
        >
          导入
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        cell-style="padding: 4px 0"
        style="width: 100%;"
        size="medium"
    >
      <!--      <el-table-column type="selection" header-align="center" align="center" width="50"/>-->
      <!--      <el-table-column type="index" header-align="center" align="center" width="100" label="序号">-->
      <!--        <template #default="scope">-->
      <!--          <span>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column prop="patientName" header-align="center" align="center" min-width="100" label="病人姓名"/>
      <el-table-column prop="patientSex" header-align="center" align="center" min-width="60" label="病人性别"/>
      <el-table-column prop="patientTel" header-align="center" align="center" min-width="130" label="病人电话"/>
      <el-table-column
          prop="hospital"
          header-align="center"
          align="center"
          min-width="120"
          label="医院"
          :show-overflow-tooltip="true"
      />
      <el-table-column
          prop="department"
          header-align="center"
          align="center"
          min-width="120"
          label="科室"
          :show-overflow-tooltip="true"
      />

      <el-table-column prop="doctor" header-align="center" align="center" min-width="100" label="医生"/>
      <el-table-column prop="cost" header-align="center" align="center" min-width="100" label="费用"/>
    </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      dataForm: {
        name: '',
      },
      dataRule: {
        name: [{required: false}]
      },
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
    }
  },

  created: function () {
    this.loadDataList();
  },
  methods: {
    searchHandle: function () {
      this.loadDataList()
    },
    importHandle: function () {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.xls, .xlsx'; // 可以选择Excel文件类型
      fileInput.onchange = (event) => this.handleFileChange(event);
      fileInput.click();
    },

    handleFileChange(event) {
      let that = this
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        console.info('file', file);
        // 使用axios或其他库发送文件到后端
        that.$httpUpload('reimbursement/uploadReimbursementData', 'POST', formData, true, function (resp) {
          console.info('上传结果', resp);
          if (resp.code === 200) {
            console.info('上传成功', resp);
            that.loadDataList();
          }
        });
      } else {
        console.error('请选择要上传的文件');
      }
    },
    selectionChangeHandle: function () {

    },

    sizeChangeHandle(val) {
      this.pageSize = val;
      //更改每页显示记录数量后，都从第一页开始查询
      this.pageIndex = 1;
      this.loadDataList();
    },
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.loadDataList();
    },
    loadDataList: function () {
      let that = this;
      //请求后端数据的时候，让表格出现循环滚动的等待图标
      that.dataListLoading = true;
      let data = {
        page: that.pageIndex,
        length: that.pageSize,
        name: that.dataForm.name,
      };
      that.$http('reimbursement/searchReimbursementByPage', 'POST', data, true, function (resp) {
        let page = resp.page;
        let list = page.list;
        that.dataList = list;
        that.totalCount = page.totalCount;
        that.dataListLoading = false;
      });
    }
  }
}
</script>

<style scoped>

</style>