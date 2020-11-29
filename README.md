![Logo](https://i.imgur.com/r2sBGZM.png)

# Discord + Revolut Business integration
Hi and welcome to the Discord + Revolut Business integration! This integration will allow you to have a precise follow-up of your transfers and payments thanks to a notification system in a predefined channel. It will also allow you to give a precise bank statement to your customers on demand and the list of your accounts available on Revolut.

##### If you want to install this integration directly, please refer to [this guide]()

## Demonstration
Here are the different functionalities offered by the integration

### Follow-up of operations
New operations include the following information:
   - The id of the transaction
  - Its amount (- if negative)
  - The reference of the transaction
  - Its status
  - And the balance of the account after modification by the transaction

![New transaction](https://i.imgur.com/jmVcdmV.png)

Updates to a transaction include:
  - The id of the transaction
  - Its old status
  - Its new status

![Transaction update](https://i.imgur.com/3e9Ufe1.png)

### Display banker's identity statement
L'intégration vous permet d'afficher le relevé d'identité banquaire et toute les informations utiles tel que:
 - IBAN
  - RIB
  - The beneficiary of the account
  - Recipient's address
  - The type of transfer
  - The country of the bank
  - And the estimated time for a transfer

![display rib](https://i.imgur.com/VHUnhXW.png)

### Display list of accounts available
The integration also allows you to display the list of accounts available on your Revolut. An account contains 3 main information:
 - Account ID
  - The name of the account
  - The balance of the account

The color of the embed varies depending on the money in the account. 10 000€/$ being green and 0€/$ being red

![display accounts](https://i.imgur.com/lpTyt8M.png)

### Notify when the Revolut autorization is about to expire
The integration will send a message in the channel you have defined for automatic messages notifying you 7 days before the authorization is about to expire. The authorization has a 90-day lifetime.

![notify expiration](https://i.imgur.com/m5Jy30T.png)

## Installation
Please refer to [this document]() to setup the integration

## Todos

 - Help command

## Contributions

Feel free to contribute to this project by fork and pull request this repo!

## Donations
<a href="https://www.buymeacoffee.com/rootmeih"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=rootmeih&button_colour=FF5F5F&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"></a>