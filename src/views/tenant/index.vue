<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
      size="small"
    >
      <el-form-item label="" prop="enable">
        <el-select
          v-model="queryParams.enable"
          filterable
          placeholder="启用状态"
          style="width: 180px"
          clearable
          @change="handleQuery"
        >
          <el-option label="启用" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="search">
        <el-input
          v-model="queryParams.search"
          placeholder="公司名称/联系人/电话"
          clearable
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="intoDataRange"
          type="daterange"
          align="right"
          unlink-panels
          style="width: 280px"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="入驻时间：开始"
          end-placeholder="结束"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="arrivalDataRange"
          type="daterange"
          align="right"
          unlink-panels
          style="width: 280px"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="到期时间：开始"
          end-placeholder="结束"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改
        </el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="公司名称"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="公司负责人"
        align="center"
        prop="contact"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="	负责人电话"
        align="center"
        prop="account"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="公司地址"
        align="center"
        prop="companyAddress"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="入驻时间"
        align="center"
        prop="intoTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="到期时间"
        align="center"
        prop="arrivalTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="启用状态" align="center" prop="enable">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enable"
            active-value="0"
            :disabled="scope.row.id === 1"
            inactive-value="1"
            @change="changeStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            :disabled="scope.row.id === 1"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            :disabled="scope.row.id === 1"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.current"
      :limit.sync="queryParams.size"
      @pagination="getList"
    />

    <el-dialog
      :visible.sync="open"
      top="0vh"
      width="800px"
      custom-class="right-dialog"
      :show-close="false"
      append-to-body
      :close-on-click-modal="false"
    >
      <div class="right-dialog-header">
        <div class="right-dialog-title">{{ title }}</div>
        <div>
          <el-button class="gray-btn" size="small" v-throttle @click="cancel"
            >取消</el-button
          >
          <el-button
            class="dark-green-btn"
            size="small"
            v-throttle
            @click="submitForm"
            >保存</el-button
          >
        </div>
      </div>
      <el-form
        class="right-dialog-content"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="公司图标" prop="avatar">
              <ImageUpload :value="form.avatar" @input="handleUploadSuccess" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="公司名称" prop="name">
              <el-input v-model.trim="form.name" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="公司简称" prop="introduce">
              <el-input
                v-model.trim="form.introduce"
                placeholder="请输入公司简称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="公司地址" prop="companyAddress">
              <el-input
                v-model.trim="form.companyAddress"
                placeholder="请输入公司地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="工厂地址" prop="factoryAddress">
              <el-input
                v-model.trim="form.factoryAddress"
                placeholder="请输入工厂地址"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="公司负责人" prop="contact">
              <el-input
                v-model.trim="form.contact"
                placeholder="请输入公司负责人"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="负责人电话" prop="account">
              <el-input
                v-model.trim="form.account"
                placeholder="请输入负责人电话"
                maxlength="11"
                :disabled="!!form.id"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="入驻时间" prop="intoTime">
              <el-input v-model.trim="form.intoTime" placeholder="" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="到期时间" prop="arrivalTime">
              <el-date-picker
                v-model="form.arrivalTime"
                type="date"
                placeholder="选择到期日期"
                style="width: 100%"
                :picker-options="endDatePicker"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18" :offset="3">
            <el-form-item label="启用状态" prop="enable">
              <el-switch
                v-model="form.enable"
                active-value="0"
                inactive-value="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ImageUpload from "@/components/ImageUpload";
import {
  tenantList,
  tenantAdd,
  tenantEdit,
  tenantDel,
  tenantDetail,
  tenantChangeStatus,
} from "@/api/system/tenant";

export default {
  name: "Tenant",
  components: {
    ImageUpload,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 参数表格数据
      tableList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        enable: undefined,
        search: undefined,
      },
      intoDataRange: [],
      arrivalDataRange: [],

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        avatar: [
          { required: true, message: "公司图标不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "公司名称不能为空", trigger: "blur" },
        ],
        companyAddress: [
          { required: true, message: "公司地址不能为空", trigger: "blur" },
        ],
        contact: [
          { required: true, message: "公司负责人不能为空", trigger: "blur" },
        ],
        account: [
          { required: true, message: "负责人电话不能为空", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "联系电话格式不正确",
            trigger: "blur",
          },
        ],
        arrivalTime: [
          { required: true, message: "到期时间不能为空", trigger: "blur" },
        ],
      },

      endDatePicker: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 24 * 60 * 60 * 1000;
        },
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true;
      this.dealTime(this.queryParams, this.intoDataRange, "into");
      this.dealTime(this.queryParams, this.arrivalDataRange, "arrival");
      tenantList(this.queryParams).then((response) => {
        this.tableList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    dealTime(params, dataRange, propName) {
      if (dataRange && dataRange.length) {
        this.queryParams[propName + "StartTime"] = dataRange[0];
        this.queryParams[propName + "EndTime"] = dataRange[1];
      } else {
        this.queryParams[propName + "StartTime"] = undefined;
        this.queryParams[propName + "EndTime"] = undefined;
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        avatar: "",
        name: "",
        introduce: "",
        companyAddress: "",
        factoryAddress: "",
        contact: "",
        account: "",
        intoTime: this.$moment(new Date()).format("YYYY-MM-DD"),
        arrivalTime: "",
        enable: "0",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.intoDataRange = null;
      this.arrivalDataRange = null;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增";
    },

    handleUploadSuccess(val) {
      this.form.avatar = val;
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single =
        selection.length !== 1 || (selection.length && selection[0].id === 1);
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      tenantDetail(row.id || this.ids).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "编辑";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let request = this.form.id ? tenantEdit : tenantAdd;
          request(this.form).then((res) => {
            this.msgSuccess(this.form.id ? "修改成功" : "新增成功");
            this.open = false;
            this.getList();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(`是否确认删除${row.id ? "该" : "这些"}公司?`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return tenantDel(row.id || this.ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 切换状态 */
    changeStatus(row) {
      this.$confirm(
        `是否确认${row.enable === "1" ? "禁用" : "启用"}该公司?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          tenantChangeStatus({
            id: row.id,
            enable: row.enable,
          })
            .then((res) => {
              this.msgSuccess(`${row.enable === "1" ? "禁用" : "启用"}成功`);
            })
            .catch(() => {
              row.enable = row.enable === "1" ? "0" : "1";
            });
        })
        .catch(() => {
          row.enable = row.enable === "1" ? "0" : "1";
        });
    },
  },
};
</script>
