export default function SearchFilter({value, searchField, data, success, error}){
    try{
        let text = value;
        let result = [];

        if(text === '')
        {
            success(data);
        }
        else if(searchField[0] !== 'all')
        {
            result = data.filter((list) => {
                for(let item of searchField){
                    if(item == 'GroupID'){
                        for(let userGroup of list.UserGroup){
                            if(String(userGroup.GroupID).toLowerCase().includes(String(text).toLowerCase())){
                                return 1;
                            }
                        };
                    }else{
                        if(String(list[item]).toLowerCase().includes(String(text).toLowerCase())){
                            return 1;
                        }
                    }
                    
                }
            });

            success(result);
        }
        else{
            result = data.filter((list) => {
                for(let item in list){
                    if(String(list[item]).toLowerCase().includes(String(text).toLowerCase())){
                        return 1;
                    }
                }
            });

            success(result);
        }
    }catch(err){
        error(err);
    }
}