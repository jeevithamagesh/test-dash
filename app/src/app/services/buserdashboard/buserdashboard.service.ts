/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE CLASS NAME*/
import { Injectable } from '@angular/core';
import { BDataModelService } from '../../service/bDataModel.service';

@Injectable()
export class buserdashboardService {

    activeusers = [
        {
            cardTitle: '10 Months',
            cardSubTitle: 'Active duration',
            cardContent: 'And four weeks',
        },
    ];
    userviews = [
        {
            cardTitle: '226,802',
            cardSubTitle: 'page views',
            cardContent: 'Page views in last month',
        },
    ];
    useractivity = [
        {
            cardTitle: '$1 206,90',
            cardSubTitle: 'All INCOME',
            cardDesc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
            cardIcon: 'timeline',
            cardbuffer: '80',
            cardinfo: 'Pages / Visit',
            cardinfo1: '% New Visits',
            cardvalue: '7.80',
            cardvalue2: '76.43%',

        },
        {
            cardTitle: '201',
            cardSubTitle: 'PAGE VIEWS',
            cardDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit vestibulum.',
            cardIcon: 'share',
            cardbuffer: '40',
            cardinfo: 'Today Visits',
            cardinfo1: 'Last Day Visits',
            cardvalue: '7.80',
            cardvalue2: '76.43%',
        },
        {
            cardTitle: '860k+',
            cardSubTitle: 'USERS ACTIVITY',
            cardDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit vestibulum.',
            cardbuffer: '65',
            cardIcon: 'laptop',
            cardinfo: 'Active Users',
            cardinfo1: 'Visits',
            cardvalue: '45.80',
            cardvalue2: '50.43%',
        },
        {
            cardTitle: '201',
            cardSubTitle: 'TODAY INCOME',
            cardDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit vestibulum.',
            cardbuffer: '75',
            cardIcon: 'attach_money',
            cardinfo: 'Today',
            cardinfo1: 'Last week',
            cardvalue: '$230,00',
            cardvalue2: '$7 980,60',
        },


    ];
    currentactivity = [
        {
            cardTitle: '$1 206,90',
            cardSubTitle: 'Current Activity',
            cardTitle1: 'Social users',
            cardDesc: 'Lorem Ipsum is simply dummy text of the printing simply all dummy text. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been. ',
            cardIcon: 'group_add',

            cardinfo: '300,102',
            cardinfo1: '280,200',
            cardvalue: '98%',
            cardvalue1: '98%',

            cardinfo2: '120,108',
            cardinfo3: '450,600',
            cardvalue2: '38%',
            cardvalue3: '28%',

        }
    ];
    userimprovements = [
        {

            cardSubTitle: 'User Improvements',
            cardIcon: 'group',
            cardinfo: 'Users Activity',
            cardDesc: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
        }
    ];

    lastactiveusers = [
        {
            cardSubTitle: 'Users Last Activity',
            cardIcon: 'local_activity',

        }
    ];

    useritems = [
        {
            cardTitle: '2,773',
            cardSubTitle: 'Tota Messages Sent',
            cardSubTitle1: '98%',
        },
        {
            cardTitle: '4,422',
            cardSubTitle: 'Last activity',
            cardSubTitle1: '13%',
        },
        {
            cardTitle: '9,180',
            cardSubTitle: 'Monthly income',
            cardSubTitle1: '22%',
        },
        {
            cardTitle: '1,450',
            cardSubTitle: 'Tota Messages Sent',
            cardSubTitle1: '44%',
        }
    ];

    menu = [
        {
            nav_one: 'Dashboard',
        }
    ];
    menuitem = [
        {
            navitem: 'Analytics'                    
        },
        {
            navitem: 'Interface'
        },
        {
             navitem: 'App Views'
        },
         {
             navitem: 'Charts'
        },
        {
             navitem: 'Box Transitions'
        }
    ];


    constructor(private bdms: BDataModelService) {
        // this.dm = new ModelMethods(bdms);
    }


    ngOnInit() {

    }


}
