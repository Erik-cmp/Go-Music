import Header from "@/components/Header";
import AccountContent from "./components/AccountContent";

const Account = () => {
  return (  
    <div 
      className="
        bg-neutral-900                
        h-[calc(100vh-95px)]
        w-full
        overflow-hidden
        overflow-y-auto
        rounded-lg        
    ">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-bold">
            Account Settings
          </h1>
        </div>
      </Header>      
      <AccountContent />
    </div>
  );
}
 
export default Account;