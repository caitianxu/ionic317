
#import "CDVBookRead.h"
// #import "MyApp-Swift.h"

@implementation CDVBookRead

- (void)reader:(CDVInvokedUrlCommand*)command{
    NSDictionary *paras = command.arguments[0];
    NSString *bookid = [paras objectForKey:@"bookid"];
    //NSLog(@"9999999999999999");
    
    // dispatch_async(dispatch_get_main_queue(), ^{
    //     [RouterOC gotoWithBook:bookid];
    // });
    
}

@end

