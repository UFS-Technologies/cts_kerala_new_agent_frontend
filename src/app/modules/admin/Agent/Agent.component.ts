import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Agent_Service } from '../../../services/Agent.Service';
import { DialogBox_Component } from '../DialogBox/DialogBox.component';
import { Agent } from '../../../models/Agent';
import {MatDialog} from '@angular/material';
import { ROUTES,Get_Page_Permission } from '../../../components/sidebar/sidebar.component';
import { Status } from '../../../models/Status';
import { Mode } from '../../../models/Mode';
import { District } from '../../../models/District';
import { Client_Accounts } from '../../../models/Client_Accounts';
import { Receipt_Voucher } from '../../../models/Receipt_Voucher';
import { Category } from '../../../models/Category';
import {environment} from '../../../../environments/environment'
import {Course_Type} from '../../../models/Course_Type';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Subscription } from 'app/models/Subscription';
export const MY_FORMATS = {
parse: {
dateInput: 'DD/MM/YYYY',
},
display: {
    dateInput: 'DD/MM/YYYY',monthYearLabel: 'MMM YYYY',dateA11yLabel: 'DD/MM/YYYY',monthYearA11yLabel: 'MMMM YYYY',
},
};

declare var Razorpay: any;

const moment = _rollupMoment || _moment;

@Component({
selector: 'app-Agent',
templateUrl: './Agent.component.html',
styleUrls: ['./Agent.component.css']
})
export class AgentComponent implements OnInit 
{
    Agent_Data:Agent[]
    Agent_:Agent= new Agent();
    Agent_Name_Search:string;
    Entry_View:boolean=true;
    EditIndex: number;
    Total_Entries: number;
    color = 'primary';
    mode = 'indeterminate';
    value = 50;
    issLoading: boolean;
    Permissions: any;
    Agent_Edit:boolean;
    Agent_Save:boolean;
    Agent_Delete:boolean;
    myInnerHeight: number;
    myTotalHeight: number;
    Approval_Status: Status = new Status();
    Category_Id: Category = new Category();
    Photo: Agent = new Agent();
    Agent_Id_Edit:number;
    ImageFile_Photo_view:any;
    Status_Data: Status[]
    Status_Temp:Status= new Status();
    Save_Call_Status: boolean = false;

   

    Select_View:boolean=false;


// Course_Type_: Course_Type = new Course_Type();
// Course_Type_Data: Course_Type[];

Course_Type_: Course_Type = new Course_Type();
Course_Type_Data : Course_Type[];
Course_Type_Name_Search: string;


    Total_Rows: number = 0;

    Page_Start:number=1;
    Page_End:number=0;
    Page_Length_:number=10;

    // Category_Data: Category[]
    Category_Temp:Category= new Category();

    Category_Data:Category[]
    Category_Type_:Category= new Category();
    Category_Type_Temp:Category= new Category();

    Registration_Visiblility:boolean=true;
    Remove_Registration_Visibility:boolean=true;

    Registration_Permissions: any;
    Remove_Registration_Permissions: any;

    Login_User:string="0";
    tab_view:boolean=true;

    profile_View:boolean=true;
    Receipt_View:boolean=false;
    Receipt_Click_Status:boolean
    year: any;
    month: any;
    day: any;
    date: any;
    Search_FromDate:Date=new Date();

    Search_ToDate:Date=new Date();
    ImageFile: any;
    file: File;
    Agentfile:string;
    AgentReceipt_View:boolean=false;
    Receipt_History_View:boolean=false;

    Mode:Mode=new Mode();
    Mode_Temp:Mode=new Mode();
    Mode_Data:Mode[]

    Receipt_Voucher_:Receipt_Voucher=new Receipt_Voucher;
    Receipt_Voucher_Data:Receipt_Voucher[]

    Client_Accounts_:Client_Accounts=new Client_Accounts;
    Client_Accounts_Temp:Client_Accounts=new Client_Accounts;
    Client_Accounts_Data:Client_Accounts[]

    Receipt_Voucher_Index:number=-1;
    Fees_Tab_Permission: any;
    Fees_Tab_View: boolean = false;
    Fees_Tab_Edit: boolean = false;
    Registration: boolean = false;

    District_:District=new District;
    District_Temp:District=new District;
    District_Data:District[]

  
    Subscription_:Subscription= new Subscription();
    Subscription_Temp:Subscription=new Subscription;
    Subscription_Data:Subscription[]

    submitted:boolean=true;
    loading:boolean=true;
    razorPayData: any;
    razorPayOptions: any;
    OrderId:number;
    TotalAmount:number;
    Grandamt:number;
    id :number;
    paymentId:string;
constructor(public Agent_Service_:Agent_Service, private route: ActivatedRoute, private router: Router,public dialogBox: MatDialog) { }
ngOnInit() 
{

    debugger
    this.Login_User=localStorage.getItem(("Login_User"));
    this.Permissions = Get_Page_Permission(23);
    if(this.Permissions==undefined || this.Permissions==null)
    {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
    }
    else
    {
    this.Agent_Edit=this.Permissions.Edit;
    this.Agent_Save=this.Permissions.Save;
    this.Agent_Delete=this.Permissions.Delete;


    // this.Load_Mode();
    // this.Load_District();


    this.Page_Load()
    this.verifyPayment()
    if (this.Fees_Tab_Permission != undefined && this.Fees_Tab_Permission != null)
    {
    this.Fees_Tab_Edit=this.Fees_Tab_Permission.Edit;
    this.Fees_Tab_View=this.Fees_Tab_Permission.View
    }
    }
}
Page_Load()
{
    this.Search_Course_Status();
    this.Load_Agent_Dropdowns();
    // this.Load_Agent_Dropdowns();
    // this.Load_Mode();
    // this.Load_District();

    this.Page_End = this.Page_Length_;
    // this.myInnerHeight = (window.innerHeight);
    // this.myInnerHeight = this.myInnerHeight - 200;
    this.myInnerHeight = (window.innerHeight);
    this.myTotalHeight=this.myInnerHeight
    this.myTotalHeight=this.myTotalHeight-40;
    this.myInnerHeight = this.myInnerHeight - 10;
    this.Clr_Agent();
    this.tab_view = true;
    this.profile_View = false;
    this.AgentReceipt_View=false;
    this.Receipt_History_View=false;
    
    // this.Search_Agent();

    this.Clr_Receipt_Voucher();
    this.Entry_View=false;
    this.Remove_Registration_Visibility=false;
    this.Registration_Visiblility=false
    this.Get_Menu_Status(24,this.Login_User)
    this.Get_Menu_Status(25,this.Login_User)
    this.Get_Menu_Status(26,this.Login_User)

  
}
verifyPayment(){
    this.route.queryParams.subscribe((params) => {
        if(params['merchantTransactionId'] ){
            var merchantTransactionId = params['merchantTransactionId'];
            var Agent_Id = params['Agent_Id'];
            var Subscription_Id = params['Subscription_Id'];
            var Subscription_Name = params['Subscription_Name'];
            var Duration = params['Duration'];
            var Subscription_Amount = params['Subscription_Amount'];
            this.issLoading=true;
            this.Agent_Service_.Verify_Payment({
                "merchantTransactionId":merchantTransactionId,
                "Agent_Id":Agent_Id,
                "Subscription_Id":Subscription_Id,
                "Subscription_Name":Subscription_Name,
                "Duration":Duration,
                "Subscription_Amount":Subscription_Amount
            }).subscribe((result)=>{
                console.log('result: ', result);
                if(result[0].Agent_Id_ >0){
                    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Paid Successfully',Type:"false"}});
                    this.Page_Load();
                }else{
                    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Payment Failed',Type:"2"}});
                }

            })

        }
        
      });
}
Get_Menu_Status(Menu_id, Login_user_id)
{
    this.issLoading = true;
    this.Agent_Service_.Get_Menu_Status(Menu_id,Login_user_id).subscribe(Rows => {  
    if(Menu_id==23)
    if (Rows[0][0]==undefined)
    {
    localStorage.removeItem('token');
    this.router.navigateByUrl('Home_Page');
    }  

    var a=Rows[0]

    if (Rows[0][0]!=undefined)
    if (Rows[0][0].View >0)
    {

    if(Menu_id==23)
    {
    this.Permissions=Rows[0][0];
    if(this.Permissions==undefined || this.Permissions==null)
    {
    localStorage.removeItem('token');
    this.router.navigateByUrl('Home_Page');
    }
    this.Agent_Edit=this.Permissions.Edit;
    this.Agent_Save=this.Permissions.Save;
    this.Agent_Delete=this.Permissions.Delete;
    }
    else if(Menu_id==25)
    {
    this.Remove_Registration_Permissions=Rows[0][0];
    if(this.Remove_Registration_Permissions.View==true)
    this.Remove_Registration_Visibility=true;
    }
    else if(Menu_id==24)
    {
    this.Registration_Permissions=Rows[0][0];
    if(this.Registration_Permissions.View==true)
    this.Registration_Visiblility=true;
    } 
    else if(Menu_id==26)
    {
    this.Fees_Tab_Permission=Rows[0][0];
    if(this.Fees_Tab_Permission.View==true)
    this.Fees_Tab_View=true;
    }
    }
    },
    Rows => {
    this.issLoading = false;
    const dialogRef = this.dialogBox.open(DialogBox_Component, { panelClass: 'Dialogbox-Class', data: { Message: 'Error Occured', Type: "2" } });
    });
}
Create_New()
{
    this.Entry_View = true;
    this.profile_View=true;
    this.AgentReceipt_View=false;
    this.Receipt_History_View=false;
    // this.Receipt_View=true;
    this.Registration_Visiblility=true;
    this.Clr_Agent();
    this.Clr_Receipt_Voucher();
}
Close_Click()
{
    let top = document.getElementById('Topdiv');
    if (top !== null) {
    top.scrollIntoView();
    top = null;
    }
    this.Entry_View = false;
    this.Search_Agent();
    // this.Clr_Agent();
    // this.Clr_Receipt_Voucher();
}
trackByFn(index, item) 
{
return index;
}
Clr_Agent()
{
    this.Select_View=false;
    this.Agent_Id_Edit=0;
    this.Agent_.Agent_Id=0;
    this.Agent_.Agent_Name="";
    this.Agent_.Address1="";
    this.Agent_.Address2="";
    this.Agent_.Address3="";
    this.Agent_.Address4="";
    this.Agent_.Pincode="";
    this.Agent_.Phone="";
    this.Agent_.Mobile="";
    this.Agent_.Whatsapp="";
    this.Agent_.Gender=0;
    this.Agent_.Email="";
    this.Agent_.Center_Code="";
    this.Agent_.Center_Name="";
    this.Agent_.Agent_Fees=0;
    this.Agent_.Alternative_Email="";
    this.Agent_.Comm_Address1="";
    this.Agent_.Comm_Address2="";
    this.Agent_.Comm_Address3="";
    this.Agent_.Comm_Address4="";
    this.Agent_.Comm_Mobile="";
    this.Agent_.Comm_Pincode="";
    this.Agent_.User_Name="";
    this.Agent_.Password="";
    this.Agent_.Photo="";
    this.Agent_.GSTIN="";
    this.Agent_.Category_Id=0;
    this.Agent_.Commission=0;
    this.Agent_.User_Id=0;
    this.Agent_.Agent_No="0";
    this.Agent_.Agent_District_No="0";
    this.Category_Type_=null;
    this.Remove_Registration_Visibility=false
    this.Registration_Visiblility=false
    this.Course_Type_.Check_Box=false;
    this.Course_Type_.Agent_Amount=0;

    if(this.Category_Data!= undefined||this.Category_Data!= null)
    this.Category_Type_ = this.Category_Data[0];
    if(this.District_Data!= undefined||this.District_Data!= null)
    this.District_ = this.District_Data[0];

    if(this.Subscription_Data!= undefined||this.Subscription_Data!= null)
    this.Subscription_ = this.Subscription_Data[0];
    
 if(this.Course_Type_Data!= undefined)
    for(var i=0;i<this.Course_Type_Data.length;i++)
    {
    this.Course_Type_Data[i].Check_Box=false
    }
    if(this.Course_Type_Data!= undefined)
       for(var i=0;i<this.Course_Type_Data.length;i++)
       {
       this.Course_Type_Data[i].Agent_Amount=0
       }

}

Category_Click()
{
    this.Agent_.Commission=this.Category_Type_.Commision_Percentage
}
Load_Agent_Dropdowns()
    {
    this.Agent_Service_.Load_Agent_Dropdowns().subscribe(Rows => {    
    if (Rows != null) {

    this.Category_Data= Rows.Category;        
    this.Category_Type_Temp.Category_Id = 0;
    this.Category_Type_Temp.Category_Name = "Select";
    this.Category_Data.unshift(this.Category_Type_Temp);
    // this.Category_Type_Search=this.Category_Type_Data[0];
    this.Category_Type_=this.Category_Data[0];


    this.Subscription_Data= Rows.Subscription;        
    this.Subscription_Temp.Subscription_Id = 0;
    this.Subscription_Temp.Subscription_Name = "Select";
    this.Subscription_Data.unshift(this.Subscription_Temp);
    this.Subscription_=this.Subscription_Data[0];

    this.Load_Mode();


    }
    this.issLoading = false;
    },
    Rows => {
    this.issLoading = false;
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
    });
}
Load_Category_Commission(Category_Id_)
{
    if(this.Category_Data==undefined || this.Category_Data.length==0)
    {
    this.issLoading = true;
    this.Agent_Service_.Load_Category_Commission(Category_Id_).subscribe(Rows => {
    if (Rows != null) {
    // this.Category_Data = Rows[0];
    this.Agent_.Commission = Rows[0];
    this.issLoading = false;
    }

    },
    Rows => {
    this.issLoading = false;
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
    });
    }
}
previous_Click()
{
     
    if (this.Page_Start > 1) {
        {
            this.Page_Start = this.Page_Start - this.Page_Length_;
            this.Page_End = this.Page_End - this.Page_Length_;
        }
      
        this.Total_Rows = this.Total_Rows - this.Agent_Data.length - this.Page_Length_;
        this.Search_Agent();
    }
}
Next_Click()
{
   
   if (this.Agent_Data.length == this.Page_Length_)
   {
   this.Page_Start = this.Page_Start + this.Page_Length_;
   this.Page_End = this.Page_End + this.Page_Length_;
 
 
       if (this.Agent_Data.length > 0)
           {
            this.Search_Agent();
           }
   }
}
Search_Course_Status() {
    this.Agent_Service_.Search_Course_Status().subscribe(Rows => {
    this.Course_Type_Data = Rows[0];
    
    if (this.Course_Type_Data.length == 0) {
    const dialogRef = this.dialogBox.open
    (DialogBox_Component, {
    panelClass: 'Dialogbox-Class'
    , data: { Message: 'No Details Found', Type: false }
    });
    }
    },
    Rows => {
      this.issLoading=false;
    });
    
    }
Search_Agent()
{

    // this.Load_Agent_Dropdowns();
    // this.Load_Mode();
    // this.Load_District();

    this.issLoading=true;
    this.Agent_Service_.Search_Agent_Skp(this.Agent_Name_Search,this.Page_Start,this.Page_End,this.Page_Length_,Number(this.Login_User)).subscribe(Rows => {

        debugger
    this.Agent_Data=Rows[0];
    var agentdata =this.Agent_Data[0]
    // agentdata =[];
    

this.Edit_Agent(agentdata,1);


    this.Total_Entries=this.Agent_Data.length;
    if(this.Agent_Data.length==0)
    {
    this.issLoading=false;
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'No Details Found',Type:"3"}});
    }
    this.issLoading=false;
    },
    Rows => { 
    this.issLoading=false;
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
    });

    console.log("this.issLoading",this.issLoading);
    this.issLoading = false;
     debugger
}
Delete_Agent(Agent_Id,index)
{
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Do you want to delete ?',Type:true,Heading:'Confirm'}});
    dialogRef.afterClosed().subscribe(result =>
    {
    if(result=='Yes')
    {
    this.issLoading=true;

    this.Agent_Service_.Delete_Agent(Agent_Id).subscribe(Delete_status => {
        Delete_status = Delete_status[0];
        Delete_status = Delete_status[0].DeleteStatus_;
    if(Delete_status==1)
    {
    this.Agent_Data.splice(index, 1);
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Deleted',Type: "false"}});
    }
    else
    {
    this.issLoading=false;
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Can not be Deleted',Type:"2"}});
    }
    this.issLoading=false;
    },
    Rows => { 
    this.issLoading=false;
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
    });
    }
    });
}
New_Date(Date_)
{
this.date=Date_
this.year = this.date.getFullYear();
this.month = this.date.getMonth() + 1;
if (this.month < 10) {
this.month = "0" + this.month;
}
this.day = this.date.getDate().toString();
if (Number.parseInt(this.day) <10) {
this.day = "0" + this.day;
}
this.date = this.year + "-" + this.month + "-" + this.day;
return this.date;
}
File_Change(event)
{
    this.file = event.target.files[0]; 
    this.ImageFile = this.file;
    this.Agentfile=this.file.name;
    this.Agent_.Photo =this.ImageFile.name;
}
Save_Agent()
{
    if(this.Agent_.Agent_Name=="" || this.Agent_.Agent_Name==undefined|| this.Agent_.Agent_Name==null)
    {
        const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data: { Message: 'Enter Owner Name', Type: "3" }});
        return;
    }
    if(this.Agent_.Mobile=="" ||this.Agent_.Mobile==null || this.Agent_.Mobile==undefined)
    {
        const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data: { Message: 'Enter Mobile', Type: "3" }});
        return;
    }
    if(this.Category_Type_==null || this.Category_Type_==undefined || this.Category_Type_.Category_Id==0 || this.Category_Type_.Category_Id==undefined )
    {
        const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data: { Message: 'Select Category', Type: "3" }});
        return;
    }

    if(this.Subscription_==null || this.Subscription_==undefined || this.Subscription_.Subscription_Id==0 || this.Subscription_.Subscription_Id==undefined )
    {
        const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data: { Message: 'Select Subscription', Type: "3" }});
        return;
    }
    debugger
    if(this.Agent_.Photo == null || this.Agent_.Photo == undefined)
    {
        this.Agent_.Photo = "";
        this.ImageFile = [];
    } 
    var Course_Type_Status=false;
    for (var j = 0; j < this.Course_Type_Data.length; j++)
    {
        if(this.Course_Type_Data[j].Check_Box== true)
        Course_Type_Status=true
    }
    if (Course_Type_Status==false)
    {
        const dialogRef = this.dialogBox.open(DialogBox_Component, { panelClass: 'Dialogbox-Class', data: { Message: 'Select Course Type', Type: "3" } });
        return
    }
    debugger
    for (var j = 0; j < this.Course_Type_Data.length; j++) {
        if (this.Course_Type_Data[j].Check_Box == true)
        {
            if (this.Course_Type_Data[j].Agent_Amount == 0||this.Course_Type_Data[j].Agent_Amount == 0||this.Course_Type_Data[j].Agent_Amount == undefined)
            {
                const dialogRef = this.dialogBox.open(DialogBox_Component, { panelClass: 'Dialogbox-Class', data: { Message: 'Enter SKP Amount', Type: "3" } });
                return
            }
        }
    }
        var Selected_Course_Type_ = [];
        for(var i=0;i<this.Course_Type_Data.length;i++)
        {
        if (this.Course_Type_Data[i].Check_Box==true)
        {
            Selected_Course_Type_.push(Object.assign({}, this.Course_Type_Data[i]));
            // Selected_Course_Type_.push({'Course_Type_Id':this.Course_Type_Data[i].Course_Type_Id});
        }
        }
            this.issLoading=true;
            debugger
            this.Agent_.Category_Id= this.Category_Type_.Category_Id;
            this.Agent_.District_Id= this.District_.District_Id;
            this.Agent_.Course_Type_Data=Selected_Course_Type_;

            this.Agent_.Subscription_Id= this.Subscription_.Subscription_Id;
            this.Agent_.Subscription_Name= this.Subscription_.Subscription_Name;
            this.Agent_.Duration= this.Subscription_.Duration;
            this.Agent_.Subscription_Amount= this.Subscription_.Subscription_Amount;

         //   this.Agent_.Client_Accounts_Id=this.Client_Accounts_.Client_Accounts_Id;

         debugger
        this.Agent_Service_.Save_Agent(this.Agent_).subscribe(Save_status => {
            
            debugger


            Save_status=Save_status[0];
            if(Number(Save_status[0].Agent_Id_)>0)
            {
            this.issLoading=false; 
            this.Agent_.Agent_Id=Save_status[0].Agent_Id_
            this.Agent_.Photo=this.Photo.Photo
            const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Saved',Type:"false"}});
            // this.Clr_Agent();

            this.Page_Load()
            }


            else if(Number(Save_status[0].Duplicate_Agent_Id)>0)
            { 
                 
            const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'The Phone Number Already Exist for '+Save_status[0].Duplicate_Agent_Name,Type:"2"}});
                this.Save_Call_Status = false;
            }


            else{
            this.issLoading=false;
            const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
            }
            this.issLoading=false;
            },
            Rows => { 
            this.issLoading=false;
            const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:Rows.error.error,Type:"2"}});
            });
}

Click_Agent_District()
{
    if(this.District_.District_Id==0 ||this.District_.District_Id==null || this.District_.District_Id==undefined)
    {
        const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data: { Message: 'Select District', Type: "3" }});
        return;
    }
    this.Agent_Service_.Click_Agent_District(this.District_.District_Id).subscribe(Rows => {
       
        this.Agent_.Center_Code = Rows[0][0].District_Code_new_;
    },
    Rows => {
        this.issLoading=false;
    });

}
Get_Status_Selection_Edit(Agent_Id) {
    this.issLoading=true;
  this.Agent_Service_.Get_CourseType_Selection_Edit(Agent_Id).subscribe(Rows => {
  this.Course_Type_Data = Rows[0];
  for(var i=0;i<this.Course_Type_Data.length;i++)
  {
  if (this.Course_Type_Data[i].Check_Box.toString()=='1')
  {
  this.Course_Type_Data[i].Check_Box=true
  }
  else 
  {
  this.Course_Type_Data[i].Check_Box=false
  }
  }
  if (this.Course_Type_Data.length == 0) 
  {
  this.issLoading=false;
  }
  },
  Rows => {
   const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
  });
  this.issLoading=false;
  }
Edit_Agent(Agent_e:Agent,index)
{

    debugger
    this.tab_view=true;
    this.profile_View=true;
    this.AgentReceipt_View=false;
    this.Receipt_History_View=false;
    this.Entry_View=true;
    this.Agent_=Agent_e;
    this.Agent_Id_Edit=Agent_e.Agent_Id;
    this.Agent_=Object.assign({},Agent_e);

    this.Remove_Registration_Visibility=false
    this.Registration_Visiblility=false
    // for(var i=0;i<this.Category_Data.length;i++)
    // {
    //     if(this.Category_Data[i].Category_Id==this.Agent_.Category_Id)
    //     {
    //         this.Category_Data=this.Category_Data[i];
    //     }
    // }
    this.ImageFile_Photo_view=environment.FilePath+ this.Agent_.Photo
    this.Registration=this.Agent_.Is_Registered;
    if(this.Agent_.Is_Registered==true)
    {
    if(this.Remove_Registration_Permissions!=undefined && this.Remove_Registration_Permissions!=null)

    if(this.Remove_Registration_Permissions.View==true)
    this.Remove_Registration_Visibility=true;
    }
    else
    {
    if(this.Registration_Permissions!=undefined &&this.Registration_Permissions!=null)
    if(this.Registration_Permissions.View==true)
    this.Registration_Visiblility=true;
    }
    for(var i=0;i<this.Category_Data.length;i++)
    {
    if(this.Category_Data[i].Category_Id==this.Agent_.Category_Id)
    {
    this.Category_Type_=this.Category_Data[i];
    }
    this.Get_Status_Selection_Edit(Agent_e.Agent_Id)
    }


    debugger

    for(var i=0;i<this.Subscription_Data.length;i++)
    {
    if(this.Subscription_Data[i].Subscription_Id==this.Agent_.Subscription_Id)
    {
    this.Subscription_=this.Subscription_Data[i];
    }
    }
    for(var i=0;i<this.District_Data.length;i++)
    {
    if(this.District_Data[i].District_Id==this.Agent_.District_Id)
    {
    this.District_=this.District_Data[i];
    }
    }
}
Tab_Click(Current_tab)
{
    
    this.profile_View=false;
    this.AgentReceipt_View=false;
    if(Current_tab==1)
    this.profile_View=true;
    else if(Current_tab==2)
    {
    this.AgentReceipt_View=true;

    if(this.Receipt_Click_Status==false)
    {
    this.Receipt_Click_Status=true
    // this.Load_Receipt_tab();
    }
    this.Clr_Receipt_Voucher();
    }
}
Save_Agent_Registration()
{
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Do you want to Register ?',Type:true,Heading:'Confirm'}});
    dialogRef.afterClosed().subscribe(result =>
    {
    if(result=='Yes')
    {
    this.issLoading = true;
    this.Agent_Service_.Save_Agent_Registration(this.Agent_.Agent_Id).subscribe(Save_status => {
    if(Number(Save_status[0][0].Agent_Id_)>0)
    {
    // this.Remove_Registration_Visibility=false
    // this.Registration_Visiblility=false
    // if(this.Remove_Registration_Permissions!=undefined &&this.Remove_Registration_Permissions!=null)
    //     if(this.Remove_Registration_Permissions.View==true)
    //          this.Remove_Registration_Visibility=true;
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Registered',Type:"false"}});
    // this.Search_Agent();
    this.Remove_Registration_Visibility=false
    this.Registration_Visiblility=false

    if(this.Remove_Registration_Permissions!=undefined &&this.Remove_Registration_Permissions!=null)
    if(this.Remove_Registration_Permissions.View==true)
    this.Remove_Registration_Visibility=true;
    }
    else{  
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
    }
    this.issLoading=false;
    },
    Rows => {
    this.issLoading=false;
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
    });
    }
    });
}

Remove_Registration()
{

    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Do you want to Remove Registration ?',Type:true,Heading:'Confirm'}});
    dialogRef.afterClosed().subscribe(result =>
    {
    if(result=='Yes')
    {
    this.issLoading=true;
    this.Agent_Service_.Remove_Registration(this.Agent_.Agent_Id).subscribe(update_status => {


    if(update_status[0][0].Agent_Id_>0)
    {

    // this.Student_Message_Data.splice(this.EditIndex, 1);
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Registration Removed',Type: "false"}});
    // this.Search_Agent();
    this.Remove_Registration_Visibility=false
    this.Registration_Visiblility=false

    if(this.Remove_Registration_Permissions!=undefined &&this.Remove_Registration_Permissions!=null)
    if(this.Registration_Permissions.View==true)
    this.Registration_Visiblility=true;

    }
    else
    {
    this.issLoading=false;
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});

    }
    this.issLoading=false;
    },
    Rows => {
    this.issLoading=false;
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
    });
    }
    });
}
Load_Mode()
    {
        this.Agent_Service_.Load_Mode().subscribe(Rows =>
    {
    this.Mode_Data= Rows[0];        
    this.Mode_Temp.Mode_Id = 0;
    this.Mode_Temp.Mode_Name = "Select";
    this.Mode_Data.unshift(this.Mode_Temp);
    this.Mode=this.Mode_Data[0]; 

    this.Load_District();
    },

    
        Rows => {
        const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}}); });
}
Load_District()
{
    this.Agent_Service_.Load_District().subscribe(Rows =>
        {
        this.District_Data= Rows[0];        
        this.District_Temp.District_Id = 0;
        this.District_Temp.District_Name = "Select";
        this.District_Data.unshift(this.District_Temp);
        this.District_=this.District_Data[0]; 

        
    this.Search_Agent();
        },
            Rows => {
            const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}}); });
    }
Accounts_Typeahead(event: any)
{     
    var Value = "";
    if (event.target.value == "")
        Value = undefined;
    else
        Value = event.target.value;
    if (this.Client_Accounts_Data == undefined || this.Client_Accounts_Data.length==0)
    {
        this.issLoading = true;
        this.Agent_Service_.Accounts_Typeahead('4,5,11',Value).subscribe(Rows => {
    if (Rows != null) 
    {
        this.Client_Accounts_Data = Rows[0];
        this.issLoading = false;
    }
    },
    Rows => {
     this.issLoading = false;
    });
    } 
}
display_Accounts(Client_Accounts_: Client_Accounts)
{     
    if (Client_Accounts_) { return Client_Accounts_.Client_Accounts_Name; }
}
Clr_Receipt_Voucher()
{
   this.Receipt_Voucher_.Receipt_Voucher_Id=0;
   this.Receipt_Voucher_.Date=new Date();
   this.Receipt_Voucher_.Date=this.New_Date(this.Receipt_Voucher_.Date);
   this.Receipt_Voucher_.Voucher_No=null;
   this.Receipt_Voucher_.From_Account_Id=0;
   this.Receipt_Voucher_.Amount=null;
   this.Receipt_Voucher_.To_Account_Id=0;
   this.Receipt_Voucher_.Payment_Mode=0;
   this.Receipt_Voucher_.User_Id=0;
   this.Receipt_Voucher_.Description="";
   this.Receipt_Voucher_.Address1="";
   this.Client_Accounts_=null;
   if(this.Mode_Data!=null && this.Mode_Data != undefined)
   this.Mode=this.Mode_Data[0];
   this.Receipt_Voucher_.Payment_Status=0;
}
// Add_Receipt()
// {
//     if (this.Mode.Mode_Id == null || this.Mode.Mode_Id == undefined || this.Mode.Mode_Id == 0 || this.Mode == null) {
//         const dialogRef = this.dialogBox.open(DialogBox_Component, { panelClass: 'Dialogbox-Class', data: { Message: 'Select Mode ', Type: "3" } });
//         return
//     }
//     else if (this.Receipt_Voucher_.Amount == undefined || this.Receipt_Voucher_.Amount == null || this.Receipt_Voucher_.Amount == 0)
//     {
//         const dialogRef = this.dialogBox.open(DialogBox_Component, { panelClass: 'Dialogbox-Class', data: { Message:'Enter the Amount',Type:"3"}});
//         return
//     }
//     else if (this.Client_Accounts_ == undefined || this.Client_Accounts_ == null || this.Client_Accounts_.Client_Accounts_Id == 0 || this.Client_Accounts_.Client_Accounts_Id == null) {
//         const dialogRef = this.dialogBox.open(DialogBox_Component, { panelClass: 'Dialogbox-Class', data: { Message: 'Select To Account ', Type: "3" } });
//         return
//     }

//     if (this.Receipt_Voucher_Data == undefined)
//         this.Receipt_Voucher_Data = [];
//     this.Receipt_Voucher_.Payment_Mode = this.Mode.Mode_Id
//     this.Receipt_Voucher_.Payment_Status = 0
//     this.Receipt_Voucher_.To_Account_Id = this.Client_Accounts_.Client_Accounts_Id
//     if (this.Receipt_Voucher_Index >= 0) {
//         this.Receipt_Voucher_Data[this.Receipt_Voucher_Index] = Object.assign({}, this.Receipt_Voucher_)// this.Sales_Details_;
//         }
//         else {
//         this.Receipt_Voucher_Data.push(Object.assign({}, this.Receipt_Voucher_));
//         }
//     this.Receipt_Voucher_Index=-1;
//     this.Clr_Receipt_Voucher();
// }
Save_Receipt_Voucher()
{
    if (this.Client_Accounts_ == undefined || this.Client_Accounts_ == null || this.Client_Accounts_.Client_Accounts_Id == undefined || this.Client_Accounts_.Client_Accounts_Id == 0) {
        const dialogRef = this.dialogBox.open(DialogBox_Component, { panelClass: 'Dialogbox-Class', data: { Message: 'Select To Account', Type: "3" } });
        }
        else if(this.Receipt_Voucher_.Amount==undefined||this.Receipt_Voucher_.Amount==null||this.Receipt_Voucher_.Amount==undefined||this.Receipt_Voucher_.Amount==0)
        {
        const dialogRef = this.dialogBox.open(DialogBox_Component, { panelClass: 'Dialogbox-Class', data: { Message: 'Enter the Amount', Type: "3" } });
        }       
        else if (this.Mode == null || this.Mode == undefined || this.Mode.Mode_Id == undefined || this.Mode.Mode_Id == 0) {
        const dialogRef = this.dialogBox.open(DialogBox_Component, { panelClass: 'Dialogbox-Class', data: { Message: 'Select Mode', Type: "3" } });
        }
else
{
        this.Receipt_Voucher_.User_Id=Number(this.Login_User);
        this.Receipt_Voucher_.From_Account_Id=this.Agent_Id_Edit;
        this.Receipt_Voucher_.Payment_Status=0;
        this.Receipt_Voucher_.To_Account_Id=this.Client_Accounts_.Client_Accounts_Id;
        this.Receipt_Voucher_.Payment_Mode=this.Mode.Mode_Id;
        
        
        this.Receipt_Voucher_.Date=this.New_Date(new Date(moment(this.Receipt_Voucher_.Date).format('YYYY-MM-DD')));
this.issLoading=true;
this.Agent_Service_.Save_Receipt_Voucher(this.Receipt_Voucher_).subscribe(Save_status => {
    
Save_status=Save_status[0];
if(Number(Save_status[0].Receipt_Voucher_Id_)>0)
{
const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Saved',Type:"false"}});
this.Clr_Receipt_Voucher();
this.Receipt_History_View=false;
//  this.Receipt_Voucher_.Voucher_No=Save_status[0].Voucher_No_;
}
else
{
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
}
this.issLoading=false;
 },
 Rows => { 
    this.issLoading=false;
const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
 });

}
}
Followup_History()
{
    if(this.Receipt_History_View==false)
    {
        this.Receipt_History_View = true;
        this.issLoading = true;

        this.Agent_Service_.Get_Receipt_History(this.Agent_Id_Edit).subscribe(Rows =>
             {                               
            this.issLoading = false;
                this.Receipt_Voucher_Data = Rows[0];

        },
            Rows => {
                this.issLoading = false;
                const dialogRef = this.dialogBox.open(DialogBox_Component, { panelClass: 'Dialogbox-Class', data: { Message: 'Error Occured', Type: false } });
            });
    }
   
    else
    this.Receipt_History_View=false

}
Edit_Receipt_Voucher(Receipt_Voucher_e:Receipt_Voucher,index)
{
this.Receipt_Voucher_=Receipt_Voucher_e;

this.Receipt_Voucher_=Object.assign({},Receipt_Voucher_e);

this.Client_Accounts_Temp.Client_Accounts_Id=Receipt_Voucher_e.To_Account_Id;
this.Client_Accounts_Temp.Client_Accounts_Name=Receipt_Voucher_e.ToAccount_Name;
this.Client_Accounts_=this.Client_Accounts_Temp;
 
 
for (var i = 0; i < this.Mode_Data.length; i++) {
    if (Receipt_Voucher_e.Payment_Mode == this.Mode_Data[i].Mode_Id)
    this.Mode = this.Mode_Data[i];
}
}
Delete_Receipt_Voucher(Receipt_Voucher_Id,index)
    {
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Do you want to delete ?',Type:"true",Heading:'Confirm'}});
    dialogRef.afterClosed().subscribe(result =>
    {
    if(result=='Yes')
    {
    this.issLoading=true;
    this.Agent_Service_.Delete_Receipt_Voucher(Receipt_Voucher_Id).subscribe(Delete_status => {
         
    if(Delete_status[0][0].Receipt_Voucher_Id_>0){
        this.Receipt_History_View=false;
    this.Receipt_Voucher_Data.splice(index, 1);
      const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Deleted',Type:"false"}});
    
    }
    else
    {
    //this.Receipt_Voucher_Data.splice(index, 1);
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Deleted',Type:"false"}});
    }
    this.issLoading=false;
    },
    Rows => { 
        this.issLoading=false;
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}}); });
    }
 });
}


// Save_Payment()
// {


//   this.issLoading=true;
// debugger
   
//     this.Agent_.Subscription_Id = this.Subscription_.Subscription_Id;
//     this.Agent_.Subscription_Name = this.Subscription_.Subscription_Name;
//     this.Agent_.Subscription_Amount = this.Subscription_.Subscription_Amount;
//     this.Agent_.Duration = this.Subscription_.Duration;
  
//   this.Agent_Service_.Save_Payment(this.Agent_).subscribe(Save_status => {
//     debugger 
//   Save_status=Save_status[0];
//   this.OrderId =Save_status[0].Agent_Id_;
//   this.TotalAmount =Save_status[0].Subscription_Amount_;
//   var TlAmt =this.TotalAmount*100

//   this.Grandamt = Number(TlAmt.toFixed(2))

//   if(Number(Save_status[0].Agent_Id_)>0)
//   {

//     debugger
//   const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Saved',Type:"false"}});
//   this.Payment_Gateway(Save_status[0].Agent_Id_);
//   // this.router.navigateByUrl('Thankyou');
//   // this.Close_Click();
//   }
//   else{
//   const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
//   }
//   this.issLoading=false;
//   },
//   Rows => { 
//   this.issLoading=false;
//   const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:Rows.error.error,Type:"2"}});
//   });


// }

Save_Payment(){

    this.Agent_.Subscription_Id = this.Subscription_.Subscription_Id;
    this.Agent_.Subscription_Name = this.Subscription_.Subscription_Name;
    this.Agent_.Subscription_Amount = this.Subscription_.Subscription_Amount;
    this.Agent_.Duration = this.Subscription_.Duration;
    if (this.Agent_.Subscription_Amount <= 0 || this.Agent_.Subscription_Amount == null || this.Agent_.Subscription_Amount == undefined) {
        const dialogRef = this.dialogBox.open(DialogBox_Component, { panelClass: 'Dialogbox-Class', data: { Message: 'Amount is not valid', Type: "3" } });
        return;
    }
    this.Agent_Service_.Initiate_Phonepe_Payment(this.Agent_).subscribe((result)=>{
        console.log("result",result);
        window.open(result['url'], '_self');
        //this.issLoading=true;
        
        })
}

Payment_Gateway( Transaction_Id)
{

  ////debugger
  const payment_amount  =  this.Grandamt;
  // const backend_url = 'https://25234399bb.ngrok.io';
  const backend_url = environment.BasePath + 'get_Payment_Gateway/' + Transaction_Id  + '/' + payment_amount ;
  const self = this;
  const options = {
  key:"rzp_live_Er8kEb2ymQbn8F",
  amount:payment_amount,
  name: 'CTS_KERALA',
  description: 'pay your subscription amount',
  prefill:
  {
    "email":  this.Agent_.Email,
    "contact": this.Agent_.Mobile,
  },
//   handler(response) {
//     ////debugger
//     console.log(response)
//     self.paymentId = response.razorpay_payment_id;

     
//       const url =  backend_url+'/razorpay/'+self.paymentId+'/'+payment_amount+'/'+self.OrderId;
//       console.log(self.paymentId) ;
//       self.Update_Subscription_Payment(self.paymentId)
     
//       ////debugger
//       fetch(url, {        
//       method: 'get',
//       headers: {
//           "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
//       }      
//       })         
//       .then(resp =>  resp.json(        
//       ))
//       .then(function (data) {
//         ////debugger;
//               console.log(data)             
//       })
//       .catch(function (error) {
//         ////debugger
//           console.log('Request failed', error);
//       }); 
//   },
//   theme: {
//       color: '#40A9FF',
//   },
  };
//   const rzp1 = new Razorpay(options); 
//   rzp1.open();  

 }

 Update_Subscription_Payment(paymentId)
 {
   ////debugger
   this.issLoading=true;
   ////debugger
   this.Agent_.Subscription_Payment_Id = paymentId;
   this.Agent_.Duration = this.Subscription_.Duration;
   this.Agent_.Agent_Id = this.OrderId;  
   this.Agent_Service_.Update_Subscription_Payment(this.Agent_).subscribe(Save_status => {
     ////debugger 
//    this.TotalAmount =Save_status[0].Total_Amount_; 
   if(Number(Save_status[0].Agent_Id_)>0)
   {
    const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Paid Successfully',Type:"false"}});
     
    this.router.navigateByUrl('Student');

    
               
                    // localStorage.clear();
                    // this.router.navigateByUrl('/auth/login');
    

}
   else{
   const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:'Error Occured',Type:"2"}});
   }
   this.issLoading=false;
   },
   Rows => { 
   this.issLoading=false;
   const dialogRef = this.dialogBox.open( DialogBox_Component, {panelClass:'Dialogbox-Class',data:{Message:Rows.error.error,Type:"2"}});
   });
 }

}
