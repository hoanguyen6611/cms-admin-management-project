export interface Test {
  data: [
    {
      amount: 0;
      code: "string";
      createdBy: "string";
      createdDate: "2023-04-13T11:52:15.570Z";
      customerAddressDto: {
        addressDetails: "string";
        createdBy: "string";
        createdDate: "2023-04-13T11:52:15.570Z";
        customerDto: {
          account: {
            avatar: "string";
            email: "string";
            fullName: "string";
            group: {
              description: "string";
              id: 0;
              kind: 0;
              name: "string";
              permissions: [
                {
                  action: "string";
                  description: "string";
                  id: 0;
                  name: "string";
                  nameGroup: "string";
                  showMenu: true;
                  status: 0;
                }
              ];
            };
            id: 0;
            isSuperAdmin: true;
            kind: 0;
            lang: "string";
            lastLogin: "2023-04-13T11:52:15.570Z";
            phone: "string";
            username: "string";
          };
          addresses: [null];
          birthday: "string";
          gender: 0;
          id: 0;
          note: "string";
          walletMoney: 0;
        };
        id: 0;
        isDefault: true;
        modifiedBy: "string";
        modifiedDate: "2023-04-13T11:52:15.570Z";
        note: "string";
        phone: "string";
        receiverFullName: "string";
        status: 0;
        typeAddress: 0;
      };
      customerDto: {
        account: {
          avatar: "string";
          email: "string";
          fullName: "string";
          group: {
            description: "string";
            id: 0;
            kind: 0;
            name: "string";
            permissions: [
              {
                action: "string";
                description: "string";
                id: 0;
                name: "string";
                nameGroup: "string";
                showMenu: true;
                status: 0;
              }
            ];
          };
          id: 0;
          isSuperAdmin: true;
          kind: 0;
          lang: "string";
          lastLogin: "2023-04-13T11:52:15.570Z";
          phone: "string";
          username: "string";
        };
        addresses: [null];
        birthday: "string";
        gender: 0;
        id: 0;
        note: "string";
        walletMoney: 0;
      };
      deliveryFee: 0;
      expectedReceiveDate: "string";
      id: 0;
      modifiedBy: "string";
      modifiedDate: "2023-04-13T11:52:15.570Z";
      note: "string";
      ordersDetailDtoList: [
        {
          amount: 0;
          createdBy: "string";
          createdDate: "2023-04-13T11:52:15.570Z";
          id: 0;
          isReviewed: true;
          modifiedBy: "string";
          modifiedDate: "2023-04-13T11:52:15.570Z";
          note: "string";
          price: 0;
          productDto: {
            avgStar: 0;
            description: "string";
            id: 0;
            image: "string";
            isLike: true;
            isSaleOff: true;
            isSoldOut: true;
            name: "string";
            parentProductId: 0;
            price: 0;
            productCategoryId: 0;
            productConfigs: [
              {
                id: 0;
                name: "string";
                variants: [
                  {
                    description: "string";
                    id: 0;
                    image: "string";
                    name: "string";
                    price: 0;
                  }
                ];
              }
            ];
            saleOff: 0;
            soldAmount: 0;
            totalReview: 0;
          };
          productVariantDto: {
            description: "string";
            id: 0;
            image: "string";
            name: "string";
            price: 0;
          };
          status: 0;
        }
      ];
      paymentMethod: 0;
      prevState: 0;
      saleOff: 0;
      saleOffMoney: 0;
      state: 0;
      status: 0;
      storeId: 0;
      totalMoney: 0;
      vat: 0;
    }
  ];
}
